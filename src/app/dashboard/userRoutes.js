const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { verifyToken } = require('./auth');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: String,
  role: {
    type: String,
    default: 'user'
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

router.post('/check-email', verifyToken, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(404).json({ 
        error: `No account found for ${email}. Please ask them to create an account first.` 
      });
    }

    res.json({ exists: true, userId: user._id });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ error: 'Server error checking email' });
  }
});

module.exports = router;
