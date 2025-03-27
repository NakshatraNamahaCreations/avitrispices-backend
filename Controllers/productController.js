const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/productModel");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads"); 
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); 
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage }).array("images", 5); 


exports.createProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }

    try {
      const { name, category, category_id, description, details, stock, variants } = req.body;

      const imageNames = req.files ? req.files.map((file) => file.filename) : [];

      // Ensure variants is parsed correctly as JSON
      let parsedVariants = req.body.variants ? JSON.parse(req.body.variants) : [];

      // Validate if all variants have valid prices
      parsedVariants.forEach((variant, index) => {
        if (isNaN(variant.price) || variant.price <= 0) {
          throw new Error(`Invalid price in variant ${index + 1}`);
        }
      });

      const newProduct = new Product({
        name,
        category,
        category_id,
        description,
        details,
        stock,
        variants: parsedVariants, // Save variants as an array of objects
        images: imageNames,
      });

      const savedProduct = await newProduct.save();
      return res.status(201).json({ success: true, message: "Product added successfully", product: savedProduct });

    } catch (error) {
      console.error("Error saving product:", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  });
};




exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const products = await Product.find(query).sort({ createdDate: -1 });

    const productsWithFixedImages = products.map((product) => {
      const fixedImages = product.images.map((img) => {
        const filename = img.split("/").pop(); // extract clean file name
        return `/uploads/${filename}`; // build clean URL
      });

      return {
        ...product.toObject(),
        images: fixedImages,
        formattedCreatedDate: product.formattedCreatedDate,
      };
    });

    res.status(200).json({ success: true, data: productsWithFixedImages });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getProductById = async (req, res) => {
  const { productId } = req.params; 
  

  console.log("Fetching product with ID:", productId); 

  try {
    const product = await Product.findById(productId); 

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const fixedImages = product.images.map((img) => `/uploads/${img}`); // Fix image paths for frontend

    return res.status(200).json({
      success: true,
      data: {
        ...product.toObject(),
        images: fixedImages, // Add images with correct URL format
      },
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.categoryName;

    const products = await Product.find({
      category: { $regex: new RegExp(`^${category}$`, "i") }, // Case-insensitive match
    }).sort({ createdDate: -1 });

    const productsWithFixedImages = products.map((product) => {
      const fixedImages = product.images.map((img) => `/uploads/${img.split("/").pop()}`);

      return {
        ...product.toObject(),
        images: fixedImages,
        formattedCreatedDate: product.formattedCreatedDate,
      };
    });

    res.status(200).json({ success: true, data: productsWithFixedImages });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.sellProduct = async (req, res) => {
  const { productId, quantitySold } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if there is enough stock
    if (product.stock < quantitySold) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    // Reduce the stock
    product.stock -= quantitySold;

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({ success: true, message: "Product sold successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error selling product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }

    try {
      const { productId } = req.params;
      console.log("Received product ID for update:", productId);

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      // Ensure variants are parsed correctly
      let parsedVariants = req.body.variants ? JSON.parse(req.body.variants) : product.variants;

      // Validate the variants
      parsedVariants.forEach((variant, index) => {
        if (isNaN(variant.price) || variant.price <= 0) {
          throw new Error(`Invalid price in variant ${index + 1}`);
        }
      });

      const imageUrls = req.files.length ? req.files.map((file) => file.filename) : product.images;

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { ...req.body, variants: parsedVariants, images: imageUrls },
        { new: true }
      );

      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  });
};




exports.getSoldProducts = async (req, res) => {
  try {
    const products = await Product.find({ sold: { $gt: 1 } })
      .sort({ sold: -1 })
      .limit(10);

    const productsWithFilenames = products.map((product) => ({
      ...product.toObject(),
      images: product.images.map((image) => path.basename(image)), // Only return filename
      formattedCreatedDate: product.formattedCreatedDate,
    }));

    res.status(200).json({ success: true, data: productsWithFilenames });
  } catch (error) {
    console.error("Error fetching sold products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params; 

    
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
