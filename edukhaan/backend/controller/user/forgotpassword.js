const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


async function ForgotPassword(req, res) {
    try {
        const { email } = req.body;

        // Validate email presence
        if (!email) {
            return res.status(400).json({
                message: "Please provide an email"
            });
        }

        // Find the user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create token
        const tokenData = {
            _id: user._id,
            email: user.email,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
            expiresIn: "8h",
        });

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.GMAIL_ID,
                pass: process.env.GMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false // Add this line
            }
        });

        // Prepare email
        const mailOptions = {
            from: process.env.GMAIL_ID,
            to: email,
            subject: "Password Reset Request",
            text: `Click on this link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        // Respond to client
        res.status(200).json({
            message: "Password reset link sent to your email.",
            success: true,
            error: false,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while processing your request.",
            error: true,
            success: false,
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Please provide a password" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const newHashPassword = bcrypt.hashSync(password, salt);

        // Update user's password
        user.password = newHashPassword;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
            success: true,
            error: false,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while processing your request.",
            error: true,
            success: false,
        });
    }
};

module.exports = { ForgotPassword, resetPassword };
