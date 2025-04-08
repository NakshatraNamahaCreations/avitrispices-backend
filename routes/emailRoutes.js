const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;
console.log("req.body",req.body)
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS, 
      },
    });

    const mailOptions = {
        from: `"${firstName} ${lastName}" <${process.env.MAIL_USER}>`,   
        to: "admin@avitrispices.in",
        replyTo: email, 
        subject: "New Contact Form Submission",
        html: `
          <h2>Contact Form Details</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      };
      

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;
