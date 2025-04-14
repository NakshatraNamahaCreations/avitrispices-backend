const Blog = require('../models/blogmodel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/blogs';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const uploadBlogImage = multer({ storage, fileFilter }).single('image');

// Create blog
const createBlog = async (req, res) => {
  try {
    const { title, description, metaTitle, metaDescription } = req.body;
    const image = req.file?.filename;

    if (!title || !description || !image) {
      return res.status(400).json({ message: 'Title, description, and image are required.' });
    }

    const blog = new Blog({ title, description, image, metaTitle, metaDescription });
    await blog.save();

    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { title, description, metaTitle, metaDescription } = req.body;
    let updateData = { title, description, metaTitle, metaDescription };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get blog by title
const getBlogById = async (req, res) => {
  try {
    const decodedTitle = decodeURIComponent(req.params.title);
    const blog = await Blog.findOne({ title: decodedTitle });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  uploadBlogImage,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById
};
