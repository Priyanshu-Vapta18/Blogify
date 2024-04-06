const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.JWT_SECRET_KEY;
const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
};
const validateToken = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};

module.exports = { createTokenForUser, validateToken };
