const userModel = require('../../models/userModel');
const twilio = require('twilio');
const bcrypt = require('bcryptjs');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

async function forgotPasswordController(req, res) {
    try {
        const { email, phoneNumber } = req.body;

        // Find user by email or phone number
        const user = await userModel.findOne({
            $or: [{ email }, { phoneNumber }],
        });

        if (!user) {
            throw new Error("User not found.");
        }

        // Generate a random reset token and hash it
        const resetToken = (Math.random() + 1).toString(36).substring(2);
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Save the hashed reset token in the user document (with expiry if desired)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send the reset token via SMS (or email)
        const message = `Your password reset link is: http://localhost:3000/reset-password/${resetToken}`;
        
        await twilioClient.messages.create({
            to: user.phoneNumber, 
            from: process.env.TWILIO_PHONE_NUMBER,
            body: message,
        });

        res.status(200).json({
            message: "Password reset link sent to your phone.",
            success: true,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = forgotPasswordController;
