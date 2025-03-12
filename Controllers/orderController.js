const Order = require("../models/ordermodel");
const mongoose = require("mongoose");
const ShippingAddress = require("../models/shippingAddressModel");
const Product = require("../models/productModel");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("shippingAddress").sort({ createdAt: -1 }).exec(); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  console.log(" Received Order Data:", req.body);

  let { cartItems, userId } = req.body;

 
  cartItems = cartItems.map(item => ({
      ...item,
      _id: mongoose.Types.ObjectId.isValid(item._id) ? new mongoose.Types.ObjectId(item._id) : new mongoose.Types.ObjectId(),
  }));

  try {
      const newOrder = new Order({
          ...req.body,
          cartItems, 
          userId: mongoose.Types.ObjectId.isValid(userId) ? userId : new mongoose.Types.ObjectId(), // ✅ Ensure userId is valid
      });

      await newOrder.save();

      res.status(201).json({ success: true, message: "Order created successfully", order: newOrder });
  } catch (error) {
      console.error(" Error creating order:", error);
      res.status(400).json({ success: false, message: error.message });
  }
};












const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).exec();

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const updateOrder = async (req, res) => {
  const { cartItems } = req.body;
  const { id } = req.params;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { cartItems },  // ✅ Ensuring cartItems with status updates are saved
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: error.message });
  }
};









const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, createOrder, updateOrder, deleteOrder, getOrdersByUserId };
