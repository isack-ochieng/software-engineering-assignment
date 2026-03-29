const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'employee'
    },
    department: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Simple comparePassword method (no bcrypt needed)
userSchema.methods.comparePassword = function(candidatePassword) {
    return this.password === candidatePassword;   // Direct string comparison
};

const User = mongoose.model("User", userSchema);
module.exports = User;