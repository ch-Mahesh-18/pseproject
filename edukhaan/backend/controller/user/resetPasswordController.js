const userModel = require('../../models/userModel');
const twilio = require('twilio');
const bcrypt = require('bcryptjs');
async function resetPasswordController(req, res) {
    try {
        const { resetToken, newPassword } = req.body;

        // Find user by the hashed reset token
        const user = await userModel.findOne({
            resetPasswordExpires: { $gt: Date.now() }, // Check if the token has not expired
        });

        if (!user) {
            throw new Error("Invalid or expired reset token.");
        }

        // Verify the reset token
        const isMatch = await bcrypt.compare(resetToken, user.resetPasswordToken);
        
        if (!isMatch) {
            throw new Error("Invalid reset token.");
        }

        // Hash the new password
        const hashPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashPassword;
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined; // Clear the expiration

        await user.save();

        res.status(200).json({
            message: "Password has been successfully reset.",
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

module.exports = resetPasswordController;
