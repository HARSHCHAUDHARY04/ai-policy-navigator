require('dotenv').config();
const mongoose = require('mongoose');
const Policy = require('./models/Policy');
const Provider = require('./models/Provider');

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

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas for seeding...');

        await Policy.deleteMany({});
        await Provider.deleteMany({});
        console.log('Cleared existing data.');

        await Policy.insertMany(initialPolicies);
        await Provider.insertMany(initialProviders);
        console.log('Successfully seeded database with initial policies and providers.');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
