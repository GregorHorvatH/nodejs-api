const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
});

mongoose.model('User', UserSchema);
