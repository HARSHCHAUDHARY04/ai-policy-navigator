const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, enum: ['health', 'life', 'motor', 'travel'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
