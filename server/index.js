require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');

// Multer setup for audio uploads
const upload = multer({ dest: 'uploads/' });

// express-mongo-sanitize is not compatible with Express v5 (req.query is read-only).
// Using a custom sanitizer instead.
function sanitizeObject(obj) {
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            } else if (typeof obj[key] === 'object') {
                sanitizeObject(obj[key]);
            }
        }
    }
    return obj;
}

const Policy = require('./models/Policy');
const Provider = require('./models/Provider');
const User = require('./models/User');
const axios = require('axios');
const SavedPolicy = require('./models/SavedPolicy');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const JWT_SECRET = process.env.JWT_SECRET || 'policyai_super_secret_jwt_key_2024';

const app = express();
const PORT = process.env.PORT || 5001;

// ─── Gemini Setup ──────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// System instruction for the model
const systemInstruction = `You are a premium Indian insurance consultant for PolicyNav AI. 
Your goal is to provide highly accurate, professional, and personalized insurance recommendations.
STRICT RULES:
1. Use real Indian insurers (e.g., HDFC Ergo, Star Health, LIC, ICICI Lombard, Niva Bupa, etc.).
2. Use specific, real plan names existing in 2024.
3. Monthly premiums must be realistic market rates for India.
4. "whyRecommended" must be insightful and directly address user constraints (age, health, budget).
5. Always return output as a structured JSON object/array matching the requested schema.
6. Real provider URLs only.`;

const geminiModel = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction,
    generationConfig: { 
        responseMimeType: 'application/json',
        temperature: 1.0 
    }
});

app.use(cors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'] : '*',
    credentials: true
}));

app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '10kb' })); // Limit body size

// Sanitize req.body (Express v5 compatible)
app.use((req, res, next) => {
    if (req.body) sanitizeObject(req.body);
    next();
});

// Validation Middleware
const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { message: 'Too many authentication attempts. Please try again in an hour.' }
});
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Health Check
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// ─── Helper: Parse Gemini JSON ─────────────────────────────────────────────────
function parseGeminiJSON(text) {
    try {
        // Find JSON block within markdown if present
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
        const cleaned = jsonMatch ? jsonMatch[1].trim() : text.trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Failed to parse Gemini JSON:", error);
        throw new Error("Invalid format received from AI.");
    }
}

/**
 * Calls the Python ML Microservice for production-grade recommendations
 */
async function callPythonML(user) {
    try {
        const payload = {
            age: parseInt(user.age) || 30,
            income: (user.annualIncome && user.annualIncome.includes('Lakh')) ? (parseInt(user.annualIncome) > 10 ? 2 : 1) : 0,
            smoker: user.smoker === 'Never' ? 0 : 1,
            dependents: parseInt(user.dependents) || 0,
            health_risk: user.preExistingConditions?.length > 0 ? 1 : 0
        };

        const response = await axios.post(`${ML_SERVICE_URL}/predict`, payload);
        return response.data.recommendations;
    } catch (error) {
        console.error('Python ML Service Error:', error.message);
        return null; // Fallback to JS-based ML
    }
}

// ─── JWT Auth Middleware ───────────────────────────────────────────────────────
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Access token required' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', validate([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(409).json({ message: 'An account with this email already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email: email.toLowerCase(), password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', validate([
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
]), async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user)
            return res.status(401).json({ message: 'Invalid email or password' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/auth/me  (protected)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/google
app.post('/api/auth/google', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: 'Google ID Token is required' });

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ 
            $or: [{ googleId }, { email: email.toLowerCase() }] 
        });

        if (!user) {
            user = new User({
                name,
                email: email.toLowerCase(),
                googleId,
                avatar: picture
            });
            await user.save();
        } else if (!user.googleId) {
            // Link existing email-only account to Google
            user.googleId = googleId;
            if (!user.avatar) user.avatar = picture;
            await user.save();
        }

        const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            message: 'Google login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/policies', async (req, res) => {
    try {
        const { type } = req.query;
        const query = type && type !== 'all' ? { type } : {};
        const policies = await Policy.find(query);
        res.json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/providers', async (req, res) => {
    try {
        const providers = await Provider.find();
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/users - Update or Create user profile
app.post('/api/users', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const updateData = { ...req.body };
        
        // Remove sensitive or unnecessary fields from body if present
        delete updateData._id;
        delete updateData.id;
        delete updateData.email;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(400).json({ message: error.message });
    }
});

// ─── AI: Quiz-Based Recommendations ───────────────────────────────────────────
// POST /api/ai/recommend
app.post('/api/ai/recommend', async (req, res) => {
    try {
        const { answers } = req.body;
        if (!answers || answers.length < 5) {
            return res.status(400).json({ message: 'Please provide all 5 quiz answers.' });
        }

        const [needType, ageGroup, budget, preExisting, priority] = answers;

        // Map quiz Q1 answer to an insurance type slug
        const needTypeMap = {
            'Health Insurance': 'health',
            'Life / Term Insurance': 'life',
            'Vehicle Insurance': 'auto',
            'Home & Property': 'property',
            'Travel Insurance': 'travel',
            'Investment + Insurance': 'life',
            'Education Insurance': 'education',
            // legacy fallbacks
            'Health Protection': 'health',
            'Life Coverage': 'life',
            'Family Floater': 'health',
        };
        const primaryType = needTypeMap[needType] || 'health';

        // Prioritize primary type for more slots (e.g. 2 slots if available)
        const allTypes = ['health', 'life', 'auto', 'property', 'travel', 'education'];
        const otherTypes = allTypes.filter(t => t !== primaryType);
        
        // Slot 1 & 2: Primary, Slot 3 & 4: different types
        const orderedTypes = [
            primaryType,
            primaryType,
            otherTypes[0],
            otherTypes[1]
        ];

        const typeDescriptions = {
            health: 'health/medical insurance (hospitalisation, cashless treatment)',
            life: 'life/term insurance (death benefit, income protection)',
            auto: 'motor/vehicle insurance (car or two-wheeler)',
            property: 'home/property insurance (house structure and contents)',
            travel: 'travel insurance (trip cancellation, medical abroad, baggage)',
            education: 'education insurance (child education plans, future schooling)',
        };

        const prompt = `
A user completed a risk profile quiz:
- Primary goal: ${needType}
- Age: ${ageGroup}
- Budget: ${budget}
- Conditions: ${preExisting}
- Primary Concern: ${priority}

Recommend 4 Indian insurance policies.
Slot 1 MUST be the primary type: "${orderedTypes[0]}".
Slots 2-4 must be these different types respectively: "${orderedTypes[1]}", "${orderedTypes[2]}", "${orderedTypes[3]}".

Return a JSON array:
[
  {
    "name": "Exact Plan Name",
    "provider": "Insurer Name",
    "type": "type_slug",
    "matchScore": number (Slot 1 highest 95+, then decreasing),
    "monthlyPremium": number,
    "coverage": "String (e.g. ₹50 Lakh)",
    "badge": "String (Only for Slot 1, e.g. 'Best Match')",
    "features": ["5 key benefits"],
    "notIncluded": ["2 main exclusions"],
    "whyRecommended": "Deeply personalized explanation.",
    "providerUrl": "Real product link"
  }
]`;

        const result = await geminiModel.generateContent(prompt);
        const text = result.response.text();
        const recommendations = parseGeminiJSON(text);

        // Safety net: if Gemini still returned duplicates, enforce types from our ordered list
        const enforced = recommendations.map((rec, i) => ({
            ...rec,
            type: orderedTypes[i] || rec.type,
        }));

        res.json({ recommendations: enforced, source: 'gemini' });
    } catch (error) {
        console.error('Recommend error:', error);
        let userMessage = 'Recommendation failed. Please try again.';
        if (error.message?.includes('API key not valid')) userMessage = 'Invalid API Key. Please update the server configuration.';
        else if (error.message?.includes('quota')) userMessage = 'Quota exceeded. Please try again later.';
        res.status(500).json({ message: userMessage, error: error.message });
    }
});

// ─── AI: Personalized Recommendations (Full Profile) ──────────────────────────
// POST /api/ai/recommend-personalized
app.post('/api/ai/recommend-personalized', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User profile not found.' });

        const profileSummary = `
- Age: ${user.age}
- Smoker: ${user.smoker}
- Health Conditions: ${user.preExistingConditions?.join(', ') || 'None'}
- Dependents: ${user.dependents}
- Vehicle: ${user.hasVehicle === 'Yes' ? user.vehicleType : 'None'}
- Income: ${user.annualIncome}
- Employment: ${user.employmentStatus}
`;

        // 1. Get policies from DB
        let availablePolicies = await Policy.find().limit(20);
        
        // 2. Fallback if DB is empty (common in dev environment)
        if (availablePolicies.length === 0) {
            availablePolicies = [
                { name: 'HDFC Ergo Optima Secure', provider: 'HDFC Ergo', type: 'health', monthlyPremium: 1200, coverage: '₹10 Lakh' },
                { name: 'Star Comprehensive', provider: 'Star Health', type: 'health', monthlyPremium: 1100, coverage: '₹5 Lakh' },
                { name: 'ICICI Prudential iProtect', provider: 'ICICI Prudential', type: 'life', monthlyPremium: 1500, coverage: '₹1 Crore' },
                { name: 'LIC Tech Term', provider: 'LIC', type: 'life', monthlyPremium: 1400, coverage: '₹50 Lakh' },
                { name: 'Digit Car Insurance', provider: 'Digit', type: 'auto', monthlyPremium: 800, coverage: 'IDV ₹5 Lakh' }
            ];
        }

        // 3. Use ML Engine to find top matches
        let mlRecommendations = [];
        const pythonResults = await callPythonML(user);
        
        if (pythonResults) {
            console.log('✅ Using Python ML Service for ranking');
            // Sort available policies based on Python confidence for each type
            const typeScores = {};
            pythonResults.forEach(r => typeScores[r.type] = r.confidence);
            
            mlRecommendations = availablePolicies
                .map(p => ({ ...p, mlScore: typeScores[p.type] || 0.1 }))
                .sort((a, b) => b.mlScore - a.mlScore)
                .slice(0, 3);
        } else {
            console.log('⚠️ Python ML unavailable. Sorting by premium as fallback.');
            mlRecommendations = availablePolicies
                .sort((a, b) => a.monthlyPremium - b.monthlyPremium)
                .slice(0, 3);
        }

        // 4. Use Gemini to provide the "Why" for these ML-selected policies
        const prompt = `
USER PROFILE:
${profileSummary}

ML-SELECTED POLICIES:
${JSON.stringify(mlRecommendations, null, 2)}

Provide a professional, persuasive explanation for why each of these 3 policies was selected for this specific user.
Return a JSON array exactly matching this schema:
[
  {
    "name": "Same Name",
    "provider": "Same Provider",
    "type": "same type",
    "matchScore": number (calculated by ML: 0-100),
    "monthlyPremium": number,
    "coverage": "₹Value",
    "features": ["5 keys"],
    "whyRecommended": "Explain why this matches their specific health conditions and income."
  }
]`;

        const result = await geminiModel.generateContent(prompt);
        const recommendations = parseGeminiJSON(result.response.text());

        res.json({ recommendations, source: 'gemini-personalized' });
    } catch (error) {
        console.error('Personalized recommend error:', error);
        res.status(500).json({ message: 'Failed to generate personalized recommendations.' });
    }
});

// ─── AI: Free-Text Search ──────────────────────────────────────────────────────
// POST /api/ai/search
// Body: { query: "best health insurance for diabetes under ₹3000/month" }
app.post('/api/ai/search', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || query.trim().length < 5) {
            return res.status(400).json({ message: 'Please enter a more detailed search query.' });
        }

        // 1. Fetch potential matches from our database first
        const typeSynonyms = {
            'health': ['health', 'medical', 'hospital', 'disease', 'illness'],
            'life': ['life', 'term', 'death', 'income protection', 'family cover'],
            'auto': ['auto', 'vehicle', 'car', 'bike', 'motor', 'scooter', 'wheeler'],
            'property': ['property', 'home', 'house', 'building', 'flat'],
            'travel': ['travel', 'trip', 'flight', 'abroad', 'baggage'],
            'education': ['education', 'college', 'school', 'university', 'student', 'tuition']
        };

        let matchedType = null;
        for (const [type, synonyms] of Object.entries(typeSynonyms)) {
            if (synonyms.some(s => query.toLowerCase().includes(s))) {
                matchedType = type;
                break;
            }
        }
        
        let dbPolicies = [];
        if (matchedType) {
            dbPolicies = await Policy.find({ type: matchedType }).limit(5);
        } else {
            // Broader keyword search if no type found
            const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
            dbPolicies = await Policy.find({
                $or: [
                    { name: { $regex: keywords.join('|'), $options: 'i' } },
                    { features: { $regex: keywords.join('|'), $options: 'i' } }
                ]
            }).limit(5);
        }

        const prompt = `
Search Query: "${query}"
Existing Database Policies: ${JSON.stringify(dbPolicies)}

Recommend 3 real Indian insurance policies. 
If any policies from the "Existing Database Policies" list are highly relevant, prioritize them.
If not, recommend other real Indian plans.
Return a JSON array:
[
  {
    "name": "Exact Plan Name",
    "provider": "Real Insurer",
    "type": "health|life|auto|property|travel|education",
    "matchScore": number,
    "monthlyPremium": number,
    "coverage": "String",
    "features": ["4-5 items"],
    "whyRecommended": "Technical explanation.",
    "providerUrl": "Real product link",
    "dbId": "Optional MongoDB _id if from database list"
  }
]`;

        const result = await geminiModel.generateContent(prompt);
        const recommendations = parseGeminiJSON(result.response.text());

        res.json({ recommendations, query, source: 'gemini-hybrid' });
    } catch (error) {
        console.error('Gemini search error:', error);
        let userMessage = 'AI search failed. Please try again.';
        if (error.message?.includes('API key not valid')) {
            userMessage = 'The AI engine is currently misconfigured (Invalid API Key).';
        } else if (error.message?.includes('quota')) {
            userMessage = 'AI engine quota exceeded.';
        }
        res.status(500).json({ message: userMessage, error: error.message });
    }
});

// ─── Policy Management ───────────────────────────────────────────────────────

// POST /api/policies/save
app.post('/api/policies/save', authenticateToken, async (req, res) => {
    try {
        const { policyId, name, provider, type, monthlyPremium, coverage, features, whyRecommended } = req.body;
        
        let actualPolicyId = policyId;
        
        // If it's a generated policy (no dbId), create it or find by name
        if (!policyId) {
            let existing = await Policy.findOne({ name, provider });
            if (!existing) {
                existing = new Policy({ 
                    name, provider, type, monthlyPremium, coverage,
                    features: features || [],
                    whyRecommended: whyRecommended || 'Personalized recommendation'
                });
                await existing.save();
            }
            actualPolicyId = existing._id;
        }

        const saved = new SavedPolicy({
            user: req.user.userId,
            policy: actualPolicyId
        });
        await saved.save();
        res.status(201).json({ message: 'Policy saved to your dashboard.', saved });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'Policy already saved.' });
        res.status(500).json({ message: error.message });
    }
});

// GET /api/policies/saved
app.get('/api/policies/saved', authenticateToken, async (req, res) => {
    try {
        const saved = await SavedPolicy.find({ user: req.user.userId }).populate('policy');
        res.json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── Analytics ───────────────────────────────────────────────────────────────

app.get('/api/analytics/risk-summary', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Logic similar to RiskDashboard.tsx but backend-driven
        const healthScore = (user.smoker === 'Never' || user.exerciseFrequency === 'Daily') ? 90 : 70;
        const propertyScore = (user.homeOwnership === 'Own' || user.homeOwnership === 'Family') ? 85 : 70;
        const vehicleScore = (user.hasVehicle === 'Yes' || user.hasVehicle === 'Multiple') ? 90 : 50;
        const employmentScore = (user.employmentStatus === 'Full-time' || user.employmentStatus === 'Self-employed') ? 90 : 70;

        const summary = {
            overallScore: Math.round((healthScore + propertyScore + vehicleScore + employmentScore) / 4),
            sectors: [
                { name: 'Health', score: healthScore },
                { name: 'Property', score: propertyScore },
                { name: 'Auto', score: vehicleScore },
                { name: 'Income', score: employmentScore }
            ],
            insights: [
                healthScore < 80 ? 'Health coverage gap detected based on smoking status.' : 'Health risk parameters optimal.',
                user.dependents > 0 ? 'High priority: Lifecycle protection (Term Insurance) recommended for dependents.' : 'Standard protection level.'
            ]
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── AI: Audio Transcription ──────────────────────────────────────────────────
// POST /api/ai/transcribe
app.post('/api/ai/transcribe', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No audio file provided.' });
        }

        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath);
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent([
            "Listen to this audio and transcribe it accurately. Only return the transcription text, nothing else.",
            {
                inlineData: {
                    data: fileContent.toString("base64"),
                    mimeType: req.file.mimetype || "audio/m4a", // expo-av default on iOS
                },
            },
        ]);

        const transcript = result.response.text().trim();

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json({ transcript });
    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ message: 'Transcription failed.', error: error.message });
        
        // Cleanup if file exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
});

// ─── Seed Route (for development) ─────────────────────────────────────────────
app.post('/api/seed', async (req, res) => {
    try {
        await Policy.deleteMany({});
        await Provider.deleteMany({});

        const initialPolicies = [
            {
                name: "Premium Health Guard",
                provider: "HDFC Ergo",
                type: "health",
                matchScore: 96,
                monthlyPremium: 3500,
                coverage: "₹50L",
                badge: "Best Match",
                features: [
                    "Pre-existing conditions covered",
                    "Preventive care 100% covered",
                    "Mental health included",
                    "Day care procedures covered",
                    "Teleconsultation access",
                ],
                notIncluded: [
                    "Cosmetic procedures",
                    "Experimental treatments",
                ],
                whyRecommended: "Based on your hypertension condition and preference for preventive care, this plan offers comprehensive coverage with reduced waiting period for pre-existing conditions.",
                providerUrl: "https://www.hdfcergo.com/health-insurance/optima-secure",
            },
            {
                name: "Essential Care",
                provider: "Star Health",
                type: "health",
                matchScore: 84,
                monthlyPremium: 2350,
                coverage: "₹25L",
                features: [
                    "Pre-existing conditions covered (2 yr wait)",
                    "Preventive care included",
                    "Emergency coverage",
                    "AYUSH treatment covered",
                ],
                notIncluded: [
                    "Mental health services",
                    "Specialist visits limited",
                    "No teleconsultation",
                ],
                whyRecommended: "A budget-friendly option that still provides essential coverage. Consider if monthly premium is a priority over comprehensive benefits.",
                providerUrl: "https://www.starhealth.in/health-insurance-plans/essential-care",
            },
            {
                name: "Comprehensive Motor Shield",
                provider: "ICICI Lombard",
                type: "auto",
                matchScore: 92,
                monthlyPremium: 1350,
                coverage: "IDV + ₹15L PA",
                badge: "Recommended",
                features: [
                    "Own damage coverage",
                    "Third-party liability",
                    "Roadside assistance",
                    "Zero depreciation add-on",
                    "Engine protection",
                ],
                notIncluded: [
                    "CNG/LPG kit (separate)",
                    "Commercial use coverage",
                ],
                whyRecommended: "Given your vehicle's age (6-10 years) and high usage, comprehensive coverage with zero depreciation protects against major repair costs.",
                providerUrl: "https://www.icicilombard.com/motor-insurance/car-insurance",
            },
            {
                name: "Home Suraksha Pro",
                provider: "Bajaj Allianz",
                type: "property",
                matchScore: 88,
                monthlyPremium: 1170,
                coverage: "₹40L",
                features: [
                    "Structure coverage",
                    "Contents protection",
                    "Burglary & theft coverage",
                    "Fire & allied perils",
                    "Public liability coverage",
                ],
                notIncluded: [
                    "Flood insurance (separate)",
                    "Earthquake coverage (add-on)",
                ],
                whyRecommended: "Your security features qualify you for discounts. This plan provides robust protection for your property value.",
                providerUrl: "https://www.bajajallianz.com/home-insurance.html",
            },
            {
                name: "Future Scholars Plan",
                provider: "HDFC Life",
                type: "education",
                matchScore: 94,
                monthlyPremium: 4500,
                coverage: "₹25L",
                badge: "Top Choice",
                features: [
                    "Guaranteed death benefit",
                    "Waiver of premium on death",
                    "Multiple payout options for college",
                    "Tax benefits under 80C",
                    "Flexible policy terms",
                ],
                notIncluded: [
                    "Loan against policy (during first 2 years)",
                    "Critical illness (add-on required)",
                ],
                whyRecommended: "Designed specifically for educational milestones, ensuring your child's future even in your absence.",
                providerUrl: "https://www.hdfclife.com/children-insurance-plans",
            },
            {
                name: "Smart Kid Education Shield",
                provider: "ICICI Prudential",
                type: "education",
                matchScore: 88,
                monthlyPremium: 3800,
                coverage: "₹20L",
                features: [
                    "Systematic savings for education",
                    "Loyalty additions",
                    "Choice of funds",
                    "Partial withdrawals allowed",
                ],
                notIncluded: [
                    "Guaranteed returns (market linked)",
                    "Pre-existing ailments",
                ],
                whyRecommended: "A market-linked plan that offers the potential for higher returns to combat rising education inflation.",
                providerUrl: "https://www.iciciprulife.com/child-insurance/buy-icici-pru-ulip-smartkid-assure.html?UID=36736&utm_source=google&utm_medium=cpc&utm_content=SK_RSA3_Brand_updated&utm_campaign=google-search-prospecting-smartkid_assure-brand-both-ind-diff1-none-rx-PM-36736&utm_source=google&utm_campaign={campaign}&utm_medium=cpc&utm_adgroup={adgroup}&utm_term=icici%20child&utm_device=c&gad_source=1&gad_campaignid=21770044462&gbraid=0AAAAADKx1uUiMD0ksGctOXWnVKEpZq-Gg&gclid=Cj0KCQjw7IjOBhDyARIsAFzrWQzjDkKmL4hn-FXuF9HfF5Uqfw7Gb_pQBRUjU5N4vR8Mb40X1sa-840aApDREALw_wcB",
            },
            {
                name: "SBI Life - Smart Champ Insurance",
                provider: "SBI Life",
                type: "education",
                matchScore: 92,
                monthlyPremium: 4200,
                coverage: "₹30L",
                features: [
                    "Guaranteed smart benefits",
                    "Waiver of premium",
                    "Life cover for parent",
                    "Tax benefits on premium",
                ],
                notIncluded: [
                    "Suicide exclusion",
                    "Aviation hazards (unless passenger)",
                ],
                whyRecommended: "A reliable traditional plan that guarantees funds for your child's higher education milestones.",
                providerUrl: "https://www.sbilife.co.in/en/individual-life-insurance/traditional/smart-champ-insurance",
            },
            {
                name: "LIC New Children's Money Back Plan",
                provider: "LIC",
                type: "education",
                matchScore: 85,
                monthlyPremium: 3200,
                coverage: "₹15L",
                features: [
                    "Survival benefits at ages 18, 20, 22",
                    "Lump sum at age 25",
                    "Participating in profits (bonuses)",
                    "Premium waiver rider option",
                ],
                notIncluded: [
                    "Waiting period for bonus",
                    "No market-linked growth",
                ],
                whyRecommended: "Safe and secure money-back plan from India's most trusted insurer, perfect for milestone-based planning.",
                providerUrl: "https://licindia.in/en/web/guest/lic-s-new-children-s-money-back-plan-plan-no.-932-uin-512n296v02-",
            },
            {
                name: "Max Life Shiksha Plus Super",
                provider: "Max Life",
                type: "education",
                matchScore: 89,
                monthlyPremium: 4800,
                coverage: "₹40L",
                features: [
                    "ULIP with dual benefits",
                    "Family income benefit",
                    "Funding of premium (FOP) included",
                    "5 fund options",
                ],
                notIncluded: [
                    "Market risks apply",
                    "5-year lock-in period",
                ],
                whyRecommended: "Comprehensive child insurance plan that combines life cover with market-linked wealth creation for education.",
                providerUrl: "https://www.maxlifeinsurance.com/child-plans/shiksha-plus-super",
            },
        ];

        const initialProviders = [
            { name: "Star Health", url: "https://www.starhealth.in", desc: "India's largest standalone health insurer", category: "health" },
            { name: "HDFC Ergo Health", url: "https://www.hdfcergo.com/health-insurance", desc: "Comprehensive health plans", category: "health" },
            { name: "LIC of India", url: "https://licindia.in", desc: "Government-backed security", category: "life" },
            { name: "Bajaj Allianz Motor", url: "https://www.bajajallianz.com/motor-insurance.html", desc: "Comprehensive motor cover", category: "motor" },
            { name: "TATA AIG Travel", url: "https://www.tataaig.com/travel-insurance", desc: "Global travel protection", category: "travel" },
        ];

        await Policy.insertMany(initialPolicies);
        await Provider.insertMany(initialProviders);

        res.json({ message: 'Database seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── AI: PolicyBot Chat ────────────────────────────────────────────────────────
// POST /api/ai/chat
// Body: { messages: [{ role: "user", content: "..." }], contextText: "Optional policy details" }
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { messages, contextText } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: 'Messages array is required.' });
        }

        const systemPrompt = `
You are "PolicyBot", a helpful and professional AI insurance assistant for PolicyNav (an Indian insurance comparison platform).
Your goal is to answer user questions about insurance policies, coverage, and general insurance terms in plain, easy-to-understand English.

${contextText ? `CONTEXT ABOUT THE CURRENT POLICY VIEWED BY USER:
${contextText}
` : ''}

STRICT RULES:
1. Be concise. Don't write essays.
2. If context is provided, prioritize it to answer questions.
3. If the user asks about specific plans, recommend Indian insurers (LIC, HDFC Ergo, ICICI Lombard, etc.).
4. Use a helpful, fintech-professional tone.
5. If you don't know something, don't make it up; admit it and suggest they contact an official broker.
6. Use simple markdown for formatting (bolding, lists).
`;

        const chat = geminiModel.startChat({
            history: [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "model", parts: [{ text: "Understood. I am PolicyBot. I will assist the user with their insurance queries based on the provided context and general Indian insurance standards." }] },
                ...messages.slice(0, -1).map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }))
            ],
            generationConfig: { maxOutputTokens: 500 }
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const responseText = result.response.text();

        res.json({ content: responseText });
    } catch (error) {
        console.error('PolicyBot error:', error);
        res.status(500).json({ message: 'Chat failed. AI engine error.', error: error.message });
    }
});

// ─── Static Frontend Serving ────────────────────────────────────────────────
const frontendPath = path.join(__dirname, '../dist');
if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    // Catch-all for React Router but exclude API routes
    app.get(/.*/, (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
