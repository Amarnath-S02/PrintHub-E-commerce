
//Order.js
const mongoose = require('mongoose');

// Define the schema for the Order collection
const orderSchema = new mongoose.Schema({
    orderID: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    orderItems: [
        {
            productName: { type: String, required: true },
            productQuantity: { type: Number, required: true },
            productPrice: { type: Number, required: true },
            // Add other product details as needed
        },
    ],
    grandTotal: {
        type: Number,
        required: true,
    },
    // Add other order details as needed
    // For example: orderDate, shippingAddress, paymentDetails, etc.
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
