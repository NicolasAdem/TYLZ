// inviteHandler.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { verifyToken } = require('./auth');

// First, define the schema
const inviteSchema = new mongoose.Schema({
  inviterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  role: {
    type: String,
    enum: ['viewer', 'commentator', 'editor', 'admin'],
    default: 'viewer'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
  }
});

// Then create the model
const Invite = mongoose.models.Invite || mongoose.model('Invite', inviteSchema);
const Project = mongoose.model('Project');

// Email configuration
const transporter = nodemailer.createTransport({
  // Configure your email service
  service: 'your-email-service',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send project invitation
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { projectId, email } = req.body;

    // Verify project exists and user has access
    const project = await Project.findOne({
      _id: projectId,
      userId: req.userId
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if invite already exists
    const existingInvite = await Invite.findOne({
      projectId,
      email,
      status: 'pending'
    });

    if (existingInvite) {
      return res.status(400).json({ error: 'Invitation already sent' });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Create new invitation
    const invite = new Invite({
      inviterId: req.userId,
      email,
      projectId,
      token,
      status: 'pending'
    });

    await invite.save();

    // Send email
    const inviteUrl = `${process.env.FRONTEND_URL}/invite/accept/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Project Invitation',
      html: `
        <h1>You've been invited to collaborate on a project</h1>
        <p>Click the link below to accept the invitation:</p>
        <a href="${inviteUrl}">Accept Invitation</a>
        <p>This link will expire in 7 days.</p>
      `
    });

    res.json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Send invite error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

// Accept invitation
router.post('/accept/:token', verifyToken, async (req, res) => {
  try {
    const invite = await Invite.findOne({
      token: req.params.token,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('projectId');

    if (!invite) {
      return res.status(404).json({ error: 'Invalid or expired invitation' });
    }

    // Update invitation status
    invite.status = 'accepted';
    await invite.save();

    // Add user to project collaborators with proper role
    await Project.findByIdAndUpdate(invite.projectId._id, {
      $addToSet: {
        collaborators: {
          userId: req.userId,
          role: invite.role || 'viewer'
        }
      }
    });

    res.json({ message: 'Invitation accepted successfully' });
  } catch (error) {
    console.error('Accept invite error:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
});

// Reject invitation
router.post('/reject/:token', verifyToken, async (req, res) => {
  try {
    const invite = await Invite.findOne({
      token: req.params.token,
      status: 'pending'
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invalid invitation' });
    }

    invite.status = 'declined';
    await invite.save();

    res.json({ message: 'Invitation declined successfully' });
  } catch (error) {
    console.error('Reject invite error:', error);
    res.status(500).json({ error: 'Failed to reject invitation' });
  }
});

// Get pending invitations for user
router.get('/pending', verifyToken, async (req, res) => {
  try {
    const invites = await Invite.find({
      email: req.user.email,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('projectId', 'title description');

    res.json(invites);
  } catch (error) {
    console.error('Fetch invites error:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
});

module.exports = router;