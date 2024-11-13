const orderModel = require("../../models/orderProductModel");
const userModel = require("../../models/userModel");

const allOrderController = async (request, response) => {
    try {
        const userId = request.userId;

        // Check if the requesting user is an admin
        const user = await userModel.findById(userId);
        if (!user || user.role !== 'ADMIN') {
            return response.status(403).json({
                message: "Access denied",
            });
        }

        // Fetch all orders with user details populated
        const allOrders = await orderModel.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email phoneNumber'); // assuming 'userId' is a reference field in orderModel

        return response.status(200).json({
            data: allOrders,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return response.status(500).json({
            message: "An error occurred while fetching orders",
            error: error.message,
        });
    }
};

module.exports = allOrderController;
