const express = require('express');
const User = require('../models/user');
const Router = express.Router();

Router.get('/signup', async (req, res) => {
  return res.render('signup');
});

Router.get('/signin', async (req, res) => {
  return res.render('signin');
});

Router.get('/logout', async (req, res) => {
  return res.clearCookie('token').redirect('/');
});

Router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Vapta');
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log('Vapta');
    return res.cookie('token', token).redirect('/');
  } catch (error) {
    console.log('error', error);
    return res.render('signin', {
      error: 'Incorrect Email and Password',
    });
  }
});

Router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = await User.create({
    fullName,
    email,
    password,
  });

  return res.redirect('/');
});

module.exports = Router;
