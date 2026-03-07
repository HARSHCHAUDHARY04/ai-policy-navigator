const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Auth fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },

    // Profile fields
    firstName: String,
    lastName: String,
    phone: String,
    dateOfBirth: Date,
    gender: String,
    maritalStatus: String,
    dependents: String,
    smoker: String,
    exerciseFrequency: String,
    preExistingConditions: [String],
    healthGoal: String,
    homeOwnership: String,
    propertyType: String,
    propertyValue: String,
    securityFeatures: [String],
    hasVehicle: String,
    vehicleType: String,
    vehicleAge: String,
    annualMileage: String,
    employmentStatus: String,
    occupation: String,
    annualIncome: String,
    industryRisk: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
