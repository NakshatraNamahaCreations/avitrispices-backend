const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");




dotenv.config();


const app = express();




app.use(
  cors({
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});


app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000, 
      maxPoolSize: 10, 
    });

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};


connectDB();


mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose connected to the database.");
});
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.warn(" Mongoose disconnected.");
});


const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/ordersRoutes");
const customerRoutes = require("./routes/customerRoutes");
const shippingAddressRoutes = require("./routes/shippingAddressRoutes"); 
const adminRoutes = require("./routes/adminRoutes");
const phonepeRoutes = require('./routes/phonepeRoutes');
const emailRoutes = require("./routes/emailRoutes");
const contactFormRoutes = require("./routes/contactFormRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes");
// const blogRoutes = require("./routes/blogRoutes");

app.use("/api/", productRoutes);
app.use("/api/shipping-address", shippingAddressRoutes); 
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/phonepe', phonepeRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/contact-form", contactFormRoutes);
app.use("/api/subscribe", subscribeRoutes);
// app.use("/api/blogs", blogRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
