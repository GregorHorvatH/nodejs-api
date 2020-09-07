const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  accessTokenId: String,
  refreshTokenId: String,
  userId: String,
});

mongoose.model('Token', TokenSchema);
