const express = require('express');
const {
  uploadBlogImage,
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require('../Controllers/blogController');

const router = express.Router();

router.post('/', uploadBlogImage, createBlog);
router.get('/', getAllBlogs);
router.put('/:id', uploadBlogImage, updateBlog);
router.delete('/:id', deleteBlog);
router.get('/:title', getBlogById);

module.exports = router;
