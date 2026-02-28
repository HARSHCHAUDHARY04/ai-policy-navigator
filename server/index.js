require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const Policy = require('./models/Policy');
const Provider = require('./models/Provider');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Gemini Setup ──────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
// Body: { answers: ["Health Protection", "18-30", "₹1,000-₹2,500", "Diabetes", "Maximum Coverage"] }
app.post('/api/ai/recommend', async (req, res) => {
    try {
        const { answers } = req.body;

        if (!answers || answers.length < 5) {
            return res.status(400).json({ message: 'Please provide all 5 quiz answers.' });
        }

        const [needType, ageGroup, budget, preExisting, priority] = answers;

        const prompt = `
You are an expert Indian insurance advisor. A user has completed a quiz and their answers are:

1. Primary insurance need: ${needType}
2. Age group: ${ageGroup}
3. Monthly budget: ${budget}
4. Pre-existing conditions: ${preExisting}
5. What matters most: ${priority}

Based on these answers, recommend exactly 3 real Indian insurance policies available in 2024.
Use only real insurers like HDFC Ergo, Star Health, LIC, ICICI Lombard, Bajaj Allianz, Care Health, Niva Bupa, SBI Life, Tata AIG, etc.

Return ONLY a valid JSON array (no markdown, no explanation outside JSON) with exactly this structure:
[
  {
    "name": "Policy Plan Name",
    "provider": "Insurer Name",
    "type": "health|life|auto|property",
    "matchScore": 95,
    "monthlyPremium": 2500,
    "coverage": "₹50L",
    "badge": "Best Match",
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
    "notIncluded": ["Exclusion 1", "Exclusion 2"],
    "whyRecommended": "Specific reason based on the user's age, budget, condition and priority.",
    "providerUrl": "https://www.realwebsite.com/product-page"
  }
]

Rules:
- Match premiums realistically to the stated budget (${budget}).
- Set matchScore between 75-98 based on how well it fits.
- Only add "badge" field to the top match ("Best Match"), omit it for others.
- Make whyRecommended personalised and specific to the user's stated needs.
- Include real, direct providerUrl for each insurer to their product page.
- Sort by matchScore descending.
`;

        const result = await geminiModel.generateContent(prompt);
        const text = result.response.text();
        const recommendations = parseGeminiJSON(text);

        res.json({ recommendations, source: 'gemini' });
    } catch (error) {
        console.error('Gemini recommend error:', error);
        res.status(500).json({ message: 'AI recommendation failed. Please try again.', error: error.message });
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
        res.status(500).json({ message: 'AI search failed. Please try again.', error: error.message });
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
