const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { router: authRouter, verifyToken } = require('./auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

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

// Project Schema
const projectSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: String,
  description: String,
  tasks: [{
    title: String,
    description: String,
    duration_days: Number,
    assigned_to: String,
    dependencies: [String],
    priority: String,
    status: String
  }],
  deadline_days: Number,
  created_at: { type: Date, default: Date.now },
  status: String
});

const Project = mongoose.model('Project', projectSchema);

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProjectPlan = async (description) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a project management expert. Create a project plan for: ${description}
    
    Respond only with a valid JSON object in this exact format, with no markdown formatting or code blocks:
    {
      "title": "Brief project title",
      "description": "${description}",
      "tasks": [
        {
          "title": "Task name",
          "description": "Task description",
          "duration_days": 5,
          "assigned_to": "Role",
          "dependencies": [],
          "priority": "high",
          "status": "pending"
        }
      ],
      "deadline_days": 30
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanedResponse = response.text().replace(/```json|```/g, '').trim();
    const projectPlan = JSON.parse(cleanedResponse);
    
    return projectPlan;

  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate project plan. Please try again later.');
  }
};

// Project routes
app.get('/api/projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId });
    res.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/generate-plan', verifyToken, async (req, res) => {
  try {
    const plan = await generateProjectPlan(req.body.description);
    const project = new Project({
      ...plan,
      userId: req.userId
    });
    const savedProject = await project.save();
    res.json(savedProject);
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate project plan' });
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