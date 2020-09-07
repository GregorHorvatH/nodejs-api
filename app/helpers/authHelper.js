const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const mongoose = require('mongoose');
const { secret, tokens } = require('../../config/app').jwt;

const Token = mongoose.model('Token');

const generateAccessToken = (userId) => {
  const payload = {
    id: v4(),
    userId,
    type: tokens.access.type,
  };
  const options = {
    expiresIn: tokens.access.expiresIn,
  };

  return {
    id: payload.id,
    token: jwt.sign(payload, secret, options),
  };
};

const generateRefreshToken = () => {
  const payload = {
    id: v4(),
    type: tokens.refresh.type,
  };
  const options = {
    expiresIn: tokens.refresh.expiresIn,
  };

  return {
    id: payload.id,
    token: jwt.sign(payload, secret, options),
  };
};

const replaceDbRefreshToken = (accessTokenId, refreshTokenId, userId) =>
  Token.findOneAndRemove({ userId })
    .exec()
    .then(() => Token.create({ accessTokenId, refreshTokenId, userId }));

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  replaceDbRefreshToken,
};
