const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model("ShippingAddress", shippingAddressSchema);
