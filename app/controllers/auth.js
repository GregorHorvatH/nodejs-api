const mongoose = require('mongoose');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authHelper = require('../helpers/authHelper');
const { secret } = require('../../config/app').jwt;

const User = mongoose.model('User');
const Token = mongoose.model('Token');

const signIn = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "User doesn't exist!" });

        return;
      }

      if (bCrypt.compareSync(password, user.password)) {
        updateTokens(user._id).then((tokens) => res.json(tokens));
      } else {
        res.json({ message: 'Invalid credentials!' });
      }
    })
    .catch((err) => res.status(500).json(err));
};

const signUp = async (req, res) => {
  const { email, name, password } = req.body;
  const payload = {
    email,
    name,
    password: bCrypt.hashSync(password, 10),
  };

  try {
    if (await User.findOne({ email }).exec()) {
      res.json({ message: 'User is already exists!' });

      return;
    }

    const user = await User.create(payload);

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const signOut = (req, res) => {
  const authHeader = req.get('Authorization');
  const token = authHeader.replace('Bearer ', '');

  try {
    const { userId } = jwt.verify(token, secret);

    Token.findOneAndRemove({ userId })
      .exec()
      .then(() => res.json({ message: 'done' }));
  } catch (err) {
    res.status(401).json({ message: 'Error logging out!' });
  }
};

const updateTokens = (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();
  const tokens = authHelper
    .replaceDbRefreshToken(accessToken.id, refreshToken.id, userId)
    .then(() => ({
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    }));

  return tokens;
};

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;
  let payload;

  try {
    payload = jwt.verify(refreshToken, secret);

    if (payload.type !== 'refresh') {
      res.status(400).json({ message: 'Invalid token!' });

      return;
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Token expired!' });

      return;
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'Invalid token!' });

      return;
    } else {
      res.status(400).json({ message: "Can't validate token!" });

      return;
    }
  }

  Token.findOne({ refreshTokenId: payload.id })
    .exec()
    .then((token) => {
      if (token === null) {
        throw new Error('Invalid token!');
      }

      return updateTokens(token.userId);
    })
    .then((tokens) => res.json(tokens))
    .catch((err) => res.status(400).json(err));
};

const getCurrentUser = (req, res) => {
  const authHeader = req.get('Authorization');
  const token = authHeader.replace('Bearer ', '');

  try {
    const { userId } = jwt.verify(token, secret);

    User.findById(userId)
      .exec()
      .then(({ email, name }) => res.json({ email, name }))
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    res.json(err);
  }
};

module.exports = {
  getCurrentUser,
  signIn,
  signUp,
  signOut,
  refreshTokens,
};
