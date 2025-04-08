const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// router.post("/", async (req, res) => {
//   const { email } = req.body;

//   // Check if email is provided
//   if (!email) {
//     return res.status(400).json({ success: false, message: "Email is required" });
//   }

//   try {
//     // Set up email transport
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.MAIL_USER, // Your email (admin@avitrispices.in)
//         pass: process.env.MAIL_PASS, // Your email password (or app password)
//       },
//     });

//     const mailOptions = {
//       from: process.env.MAIL_USER, // sender's email
//       to: "admin@avitrispices.in", // admin's email
//       subject: "New Subscription Request",
//       html: `
       
//         <p>New newsletter subscription from  ${email} via the website. Add them to the mailing list and track engagement.</p>
//       `,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ success: true, message: "Subscription successful!" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ success: false, message: "Failed to subscribe" });
//   }
// });


router.post("/", async (req, res) => {
    const { email } = req.body;
  
    // Check if email is provided
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
  
    try {
      // Set up email transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER, // Your email (admin@avitrispices.in)
          pass: process.env.MAIL_PASS, // Your email password (or app password)
        },
      });
  
      const mailOptions = {
        from: email, // Dynamic sender based on user's email
        to: "admin@avitrispices.in", // admin's email to receive the subscription request
        subject: "New Subscription Request",
        html: `
          <p>New newsletter subscription from ${email} via the website. Add them to the mailing list and track engagement.</p>
        `,
        replyTo: email,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ success: true, message: "Subscription successful!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: "Failed to subscribe" });
    }
  });
  
module.exports = router;
