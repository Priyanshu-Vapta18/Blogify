const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDb Connected'))
  .catch((err) => console.log('Error', err));

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const {
  checkForAuthenticationCookie,
} = require('./middlewares/authentication');
const Blog = require('./models/blog');
const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.use('/user', userRoute);
app.use('/blog', blogRoute);
app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({});

  res.render('home', {
    user: req.user,
    blogs: allBlogs,
  });
});
app.listen(PORT, () => console.log('Server Started'));
