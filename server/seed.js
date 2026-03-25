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
    { name: "HDFC Life", url: "https://www.hdfclife.com", desc: "Specialized education and life plans", category: "life" },
    { name: "SBI Life", url: "https://www.sbilife.co.in", desc: "Trusted banking backed insurance", category: "life" },
    { name: "Max Life", url: "https://www.maxlifeinsurance.com", desc: "Comprehensive life and child plans", category: "life" },
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
