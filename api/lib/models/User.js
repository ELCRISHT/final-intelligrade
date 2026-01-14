const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  middleInitial: {
    type: String,
    trim: true
  },
  college: {
    type: String,
    trim: true
  },
  contactNumber: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'faculty', 'student'],
    default: 'faculty'
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
