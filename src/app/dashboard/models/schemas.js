// models/schemas.js
const mongoose = require('mongoose');

// User Schema
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

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: {
    value: Number,
    unit: String
  },
  assigned_to: String,
  dependencies: [String],
  priority: String,
  status: String,
  category: String,
  complexity: String,
  position: Number,
  subtasks: [{
    description: String,
    duration: {
      value: Number,
      unit: String
    }
  }]
});

// Project Schema
const projectSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  tasks: [taskSchema],
  deadline_days: {
    type: Number,
    required: true,
    default: 7
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  isPubliclyShareable: {
    type: Boolean,
    default: false
  },
  created_at: { type: Date, default: Date.now },
  status: String,
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'commentator', 'editor', 'admin'],
      default: 'viewer'
    }
  }]
});

// Invite Schema
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
    default: () => new Date(+new Date() + 7*24*60*60*1000)
  }
});

// Create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
const Invite = mongoose.models.Invite || mongoose.model('Invite', inviteSchema);

module.exports = { User, Project, Invite };