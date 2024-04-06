const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/auth');
const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: '/images/default.png',
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static(
  'matchPasswordAndGenerateToken',
  async function (email, password) {
    const user = await User.findOne({ email });
    console.log('object', user);
    if (!user) throw new Error('User Not Found');

    const salt = user.salt;
    console.log('salt', salt);
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    if (hashedPassword !== userProvidedHash)
      throw new Error('Incorrect Password');
    const token = createTokenForUser(user);
    console.log('Tokenn2', token);

    return token;
  }
);

const User = mongoose.model('user', userSchema);

module.exports = User;
