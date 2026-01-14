const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user by Firebase UID
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid }).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new user
router.post('/', async (req, res) => {
  const user = new User({
    uid: req.body.uid,
    email: req.body.email,
    name: req.body.name,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middleInitial: req.body.middleInitial,
    college: req.body.college,
    contactNumber: req.body.contactNumber,
    role: req.body.role
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - user already exists
      try {
        const existingUser = await User.findOneAndUpdate(
          { uid: req.body.uid },
          req.body,
          { new: true }
        );
        return res.json(existingUser);
      } catch (updateError) {
        return res.status(400).json({ message: updateError.message });
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// UPDATE user
router.put('/:uid', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user
router.delete('/:uid', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
