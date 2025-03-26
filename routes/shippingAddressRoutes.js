const express = require("express");
const router = express.Router();
const ShippingAddress = require("../models/shippingAddressModel");


router.post("/", async (req, res) => {
    try {
        console.log("📥 Received Data:", req.body); // ✅ Debugging log

        const { userId, firstName, lastName, phoneNumber, address, city, state, pincode, country, email } = req.body;

        if (!userId || !firstName || !lastName || !phoneNumber || !address || !city || !state || !pincode || !country || !email) {
            return res.status(400).json({ success: false, message: "All fields are required, including userId." });
        }

        const newShippingAddress = new ShippingAddress({ userId, firstName, lastName, phoneNumber, address, city, state, pincode, country, email });

        await newShippingAddress.save();

        res.status(201).json({
            success: true,
            message: "✅ Shipping address created successfully!",
            shippingAddress: newShippingAddress,
        });

    } catch (error) {
        console.error("🚨 Error saving shipping address:", error); // ✅ Get more detailed error logs
        res.status(500).json({ success: false, message: error.message, error });
    }
});



router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        console.log("📤 Fetching addresses for userId:", userId);

        const addresses = await ShippingAddress.find({ userId });

        if (!addresses.length) {
            return res.status(404).json({ success: false, message: "No addresses found for this user." });
        }

        res.status(200).json(addresses);
    } catch (error) {
        console.error("🚨 Error fetching addresses:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});



router.get("/id/:id", async (req, res) => {
    try {
        const address = await ShippingAddress.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ success: false, message: "Shipping address not found" });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
