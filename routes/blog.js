const express = require('express');
const path = require('path');
const multer = require('multer');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

Router.get('/add-new', async (req, res) => {
  return res.render('addBlog', {
    user: req.user,
  });
});

Router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    'createdBy'
  );
  console.log('blog', blog);
  console.log('comments', comments);
  return res.render('blog', {
    user: req.user,
    blog,
    comments,
  });
});

Router.post('/comment/:blogId', async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.create({
    content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  console.log('comment', comment);
  return res.redirect(`/blog/${req.params.blogId}`);
});
Router.post('/', upload.single('coverImage'), async (req, res) => {
  const { body, title } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });

  return res.redirect(`/blog/${blog._id}`);
});

module.exports = Router;
