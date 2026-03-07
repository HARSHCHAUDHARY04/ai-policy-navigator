require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const Policy = require('./models/Policy');
const Provider = require('./models/Provider');
const User = require('./models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'policyai_super_secret_jwt_key_2024';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Gemini Setup ──────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

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
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Name, email and password are required' });
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters' });

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
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

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

app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
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
            // legacy fallbacks
            'Health Protection': 'health',
            'Life Coverage': 'life',
            'Family Floater': 'health',
        };
        const primaryType = needTypeMap[needType] || 'health';

        // Always produce exactly 4 DIFFERENT types, primary first
        const allTypes = ['health', 'life', 'auto', 'property', 'travel'];
        const orderedTypes = [
            primaryType,
            ...allTypes.filter(t => t !== primaryType).slice(0, 3)
        ]; // always 4 unique types

        const typeDescriptions = {
            health: 'health/medical insurance (hospitalisation, cashless treatment)',
            life: 'life/term insurance (death benefit, income protection)',
            auto: 'motor/vehicle insurance (car or two-wheeler)',
            property: 'home/property insurance (house structure and contents)',
            travel: 'travel insurance (trip cancellation, medical abroad, baggage)',
        };

        const prompt = `
You are an expert Indian insurance advisor. A user completed a quiz:
- Primary insurance need: ${needType}
- Age group: ${ageGroup}
- Monthly budget: ${budget}
- Pre-existing conditions: ${preExisting}
- Priority: ${priority}

You MUST return a JSON array of EXACTLY 4 Indian insurance policies.
Each policy must be a DIFFERENT type as specified below — do not deviate:

Slot 1 type: "${orderedTypes[0]}" — ${typeDescriptions[orderedTypes[0]]}
Slot 2 type: "${orderedTypes[1]}" — ${typeDescriptions[orderedTypes[1]]}
Slot 3 type: "${orderedTypes[2]}" — ${typeDescriptions[orderedTypes[2]]}
Slot 4 type: "${orderedTypes[3]}" — ${typeDescriptions[orderedTypes[3]]}

Use real Indian insurers: HDFC Ergo, Star Health, LIC, ICICI Lombard, Bajaj Allianz, 
Care Health, Niva Bupa, SBI Life, Tata AIG, Reliance General, New India Assurance, 
PNB MetLife, Kotak Life, Edelweiss Tokio, Royal Sundaram, etc.
Use a different insurer for each slot if possible.

Return ONLY a raw JSON array, no markdown, no explanation:
[
  {
    "name": "Exact Plan Name",
    "provider": "Insurer Name",
    "type": "${orderedTypes[0]}",
    "matchScore": 94,
    "monthlyPremium": 2200,
    "coverage": "₹50 Lakh",
    "badge": "Best Match",
    "features": ["feature1", "feature2", "feature3", "feature4", "feature5"],
    "notIncluded": ["exclusion1", "exclusion2"],
    "whyRecommended": "Why this fits the user specifically.",
    "providerUrl": "https://actual-insurer-website.com/product"
  },
  {
    "name": "Exact Plan Name",
    "provider": "Insurer Name",
    "type": "${orderedTypes[1]}",
    "matchScore": 89,
    "monthlyPremium": 1800,
    "coverage": "₹1 Crore",
    "features": ["feature1", "feature2", "feature3", "feature4"],
    "notIncluded": ["exclusion1"],
    "whyRecommended": "Why life insurance is also important for this user.",
    "providerUrl": "https://actual-insurer-website.com/product"
  },
  {
    "name": "Exact Plan Name",
    "provider": "Insurer Name",
    "type": "${orderedTypes[2]}",
    "matchScore": 82,
    "monthlyPremium": 1200,
    "coverage": "Comprehensive",
    "features": ["feature1", "feature2", "feature3", "feature4"],
    "notIncluded": ["exclusion1"],
    "whyRecommended": "Why ${typeDescriptions[orderedTypes[2]]} matters for this user.",
    "providerUrl": "https://actual-insurer-website.com/product"
  },
  {
    "name": "Exact Plan Name",
    "provider": "Insurer Name",
    "type": "${orderedTypes[3]}",
    "matchScore": 78,
    "monthlyPremium": 900,
    "coverage": "₹30 Lakh",
    "features": ["feature1", "feature2", "feature3"],
    "notIncluded": ["exclusion1"],
    "whyRecommended": "Why ${typeDescriptions[orderedTypes[3]]} is also worth considering.",
    "providerUrl": "https://actual-insurer-website.com/product"
  }
]

STRICT RULES:
1. Slot 1 MUST have type="${orderedTypes[0]}", slot 2 MUST have type="${orderedTypes[1]}", slot 3 MUST have type="${orderedTypes[2]}", slot 4 MUST have type="${orderedTypes[3]}".
2. All 4 types must be different — never repeat the same type string.
3. Only slot 1 gets the "badge" field. Remove "badge" from slots 2, 3, 4.
4. Slot 1 matchScore must be highest (90+), others decrease.
5. Real plan names, real insurer names, real URLs only.
`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            generationConfig: { temperature: 1.2 }
        });

        const result = await model.generateContent(prompt);
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

// ─── AI: Free-Text Search ──────────────────────────────────────────────────────
// POST /api/ai/search
// Body: { query: "best health insurance for diabetes under ₹3000/month" }
app.post('/api/ai/search', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || query.trim().length < 5) {
            return res.status(400).json({ message: 'Please enter a more detailed search query.' });
        }

        const prompt = `
You are an expert Indian insurance advisor. A user is searching for insurance with this query:
"${query}"

Analyse their requirements and recommend exactly 3 real Indian insurance policies available in 2024.
Use only real insurers: HDFC Ergo, Star Health, LIC, ICICI Lombard, Bajaj Allianz, Care Health, Niva Bupa, SBI Life, Tata AIG, Reliance General, New India Assurance, etc.

Return ONLY a valid JSON array (no markdown, no explanation outside JSON) with exactly this structure:
[
  {
    "name": "Policy Plan Name",
    "provider": "Insurer Name",
    "type": "health|life|auto|property|travel",
    "matchScore": 95,
    "monthlyPremium": 2500,
    "coverage": "₹50L",
    "badge": "Best Match",
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
    "notIncluded": ["Exclusion 1", "Exclusion 2"],
    "whyRecommended": "Clear explanation of why this policy fits the search query.",
    "providerUrl": "https://www.realwebsite.com/product-page"
  }
]

Rules:
- Only add "badge" to the top ranked result.
- Set matchScore between 75-98.
- Extract budget, age, conditions, type from the user query.
- Make whyRecommended concise and directly tied to their query.
- Include real providerUrl for each insurer.
- Sort by matchScore descending.
`;

        const result = await geminiModel.generateContent(prompt);
        const text = result.response.text();
        const recommendations = parseGeminiJSON(text);

        res.json({ recommendations, query, source: 'gemini' });
    } catch (error) {
        console.error('Gemini search error:', error);
        let userMessage = 'AI search failed. Please try again.';
        if (error.message?.includes('API key not valid')) {
            userMessage = 'The AI engine is currently misconfigured (Invalid API Key). Please update the server configuration.';
        } else if (error.message?.includes('quota')) {
            userMessage = 'AI engine quota exceeded. Please try again later.';
        }
        res.status(500).json({ message: userMessage, error: error.message });
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
