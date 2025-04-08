const express = require("express");
const ContactForm = require("../models/ContactForm");

const router = express.Router();

// POST: Submit contact form (store only)
router.post("/", async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;

  try {
    const newForm = new ContactForm({ firstName, lastName, email, phoneNumber, message });
    await newForm.save();

    res.status(200).json({ success: true, message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Contact form error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

// GET: Fetch all contact form submissions
router.get("/", async (req, res) => {
  try {
    const forms = await ContactForm.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch contact forms" });
  }
});

module.exports = router;
