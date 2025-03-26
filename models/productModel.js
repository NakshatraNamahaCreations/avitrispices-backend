const mongoose = require("mongoose");
const moment = require("moment");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  category_id: String,
  description: { type: String },
  images: { type: [String], default: [] },
  stock: { type: Number, required: true },
  variants: [{
    quantity: { type: String, required: true },
    price: { type: Number, required: true }  
  }],
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
