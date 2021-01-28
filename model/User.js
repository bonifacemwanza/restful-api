const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: false,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    //required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    //required: true,
    min: 6,
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    //required: true,
    min: 6,
    max: 255,
  },
  first_name: {
    type: String,
    min: 6,
    max: 255,
  },
  last_name: {
    type: String,
    min: 6,
    max: 255,
  },
  uid: {
    type: String

  },
  avatar: {
    type: String,
    default: "uploads/users/profile/img.png",
    min: 6,
    max: 255,
  },
  language: {
    type: String,
    default: "Turkish",
  },
  gender: {
    type: String,
    default: 1,
  },
  country: {
    type: String,
    default: "Turkey",
  },
  city: {
    type: String,
    default: "Turkey",
  },
  unique_id: {
    type: Number,
    required: true,
  },
  userPostedTitles: {
    type: Array,
  },

  about: {
    type: String,
    default: "zddfasfdadsf",
    min: 6,
    max: 500,
  },
  location: {
    type: Number,
    default: "232123",
  },
  phoneNumber: {
    type: Number,
    default: "123213",
  },
  birthdate: {
    type: String,
    default: "01.01.1960",
  },
});

module.exports = mongoose.model('User',userSchema);