const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { secret } = require('../../config/app').jwt;

const Token = mongoose.model('Token');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    res.status(401).json({ message: 'Token not provided!' });

    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, secret);

    if (payload.type !== 'access') {
      res.status(401).json({ message: 'Ivalid token!' });

      return;
    }

    Token.findOne({ accessTokenId: payload.id })
      .exec()
      .then((token) => {
        if (!token) {
          res.status(401).json({ message: 'Invalid token!' });

          return;
        }

        next();
      });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired!' });

      return;
    }

    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token!' });

      return;
    } else {
      res.status(401).json({ message: "Can't validate token!" });

      return;
    }
  }
};
