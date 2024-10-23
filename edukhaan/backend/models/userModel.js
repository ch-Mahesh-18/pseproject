const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    phoneNumber: String, // Add this field for phone numbers
    resetPasswordToken: String, // For storing the reset token
    resetPasswordExpires: Date, // For storing the token expiration
    role: String
}, {
    timestamps: true
});


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
