const mongoose = require("mongoose");
const moment = require("moment");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  category_id: String,
  status: { type: String, default: "Active" },
  description: { type: String },
  price: { type: Number, required: true },
  images: { type: [String], default: [] },
  color: { type: String },
  material: { type: String },
  details: { type: String },
  stock: { type: Number, required: true, min: 0 },
  sold: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now },
  sku: { type: String, default: () => `SKU-${Date.now()}` }, 
});


// Virtual fields
productSchema.virtual("formattedCreatedDate").get(function () {
  return moment(this.createdDate).format("DD/MM/YYYY");
});

productSchema.virtual("availableStock").get(function () {
  return this.stock - this.sold;
});

module.exports = mongoose.model("Product", productSchema);
