// gemini-server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { router: authRouter, verifyToken } = require('./auth');
const { User, Project, Invite } = require('./models/schemas');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/auth', authRouter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saas-platform')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Utility Functions
const generateProjectPlan = async (description, deadline) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are an expert project management consultant. Create a project plan for: ${description}
    Project deadline: ${deadline.value} ${deadline.unit}...`; // Your existing prompt

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let cleanedResponse = response.text()
      .replace(/```json|```/g, '')
      .replace(/^JSON\s*/, '')
      .trim();

    return formatAIResponse(cleanedResponse);
  } catch (error) {
    console.error('Generation error:', error);
    throw new Error('Failed to generate project plan: ' + error.message);
  }
};

// Routes
app.get('/api/projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { userId: req.userId },
        { 'collaborators.userId': req.userId }
      ]
    });
    res.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/invites/pending', verifyToken, async (req, res) => {
  try {
    const invites = await Invite.find({
      email: req.user.email,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('projectId', 'title description');

    // Return empty array if no invites found
    res.json(invites || []);
  } catch (error) {
    console.error('Fetch invites error:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
});

app.post('/api/generate-plan', verifyToken, async (req, res) => {
  try {
    if (!req.body.description || !req.body.deadline) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Both description and deadline are required' 
      });
    }

    const plan = await generateProjectPlan(req.body.description, req.body.deadline);
    const projectData = {
      ...plan,
      userId: req.userId,
      status: 'active',
      created_at: new Date()
    };

    const project = new Project(projectData);
    const savedProject = await project.save();
    res.json(savedProject);
  } catch (error) {
    console.error('API endpoint error:', error);
    res.status(500).json({ 
      error: 'Server Error',
      details: error.message 
    });
  }
});

app.put('/api/projects/:id/tasks', verifyToken, async (req, res) => {
  try {
    const { taskTitle, newStatus, newPosition } = req.body;
    const project = await Project.findOne({ 
      _id: req.params.id,
      userId: req.userId
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const taskIndex = project.tasks.findIndex(task => task.title === taskTitle);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    project.tasks[taskIndex].status = newStatus;

    if (typeof newPosition === 'number') {
      project.tasks.forEach(t => {
        if (t.status === newStatus && t.position >= newPosition) {
          t.position += 1;
        }
      });
      project.tasks[taskIndex].position = newPosition;
    }

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    await Project.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});