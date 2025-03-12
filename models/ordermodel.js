const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingAddress", required: true },
    cartItems: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            images: [{ type: String, required: true }],
            category: { type: String, required: true },
            status: { type: String, default: "Pending" }  // ✅ Added status field
        },
    ],
    paymentMethod: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    userId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

