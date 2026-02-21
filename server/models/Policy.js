const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    name: { type: String, required: true },
    provider: { type: String, required: true },
    type: { type: String, enum: ['health', 'property', 'auto', 'life'], required: true },
    matchScore: { type: Number, required: true },
    monthlyPremium: { type: Number, required: true },
    coverage: { type: String, required: true },
    features: [{ type: String }],
    notIncluded: [{ type: String }],
    whyRecommended: { type: String },
    badge: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
