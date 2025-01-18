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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


// Add CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

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
  project_size: String,
  tasks: [{
    title: String,
    description: String,
    duration: {
      value: Number,
      unit: String  // "minutes", "hours", "days"
    },
    assigned_to: String,
    dependencies: [String],
    priority: String,
    status: String,
    category: String,
    complexity: String,
    subtasks: [{
      description: String,
      duration: {
        value: Number,
        unit: String
      }
    }]
  }],
  total_duration: {
    minutes: Number,
    hours: Number,
    days: Number
  },
  recommended_team_size: Number,
  created_at: { type: Date, default: Date.now },
  status: String
});

const Project = mongoose.model('Project', projectSchema);

// Add this function to your backend code
const validateAndFormatTaskPriority = (priority) => {
  const validPriorities = ['critical', 'high', 'medium', 'low', 'very low'];
  const normalizedPriority = priority.toLowerCase();
  return validPriorities.includes(normalizedPriority) ? normalizedPriority : 'medium';
};

const formatAIResponse = (aiResponse) => {
  try {
    let data = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
    
    // Ensure all required fields exist
    const formattedData = {
      title: data.title || 'Untitled Project',
      description: data.description || '',
      deadline_days: data.deadline_days || 7,
      status: 'active',
      tasks: Array.isArray(data.tasks) ? data.tasks : []
    };

    // Format and validate each task
    formattedData.tasks = formattedData.tasks.map(task => ({
      title: task.title || 'Untitled Task',
      description: task.description || '',
      duration: {
        value: task.duration?.value || 1,
        unit: ['minutes', 'hours', 'days', 'weeks', 'months', 'years'].includes(task.duration?.unit) 
          ? task.duration.unit 
          : 'days'
      },
      assigned_to: task.assigned_to || 'Unassigned',
      dependencies: Array.isArray(task.dependencies) ? task.dependencies : [],
      priority: validateAndFormatTaskPriority(task.priority || 'medium'),
      status: task.status || 'pending',
      parallel_possible: Boolean(task.parallel_possible)
    }));

    // Sort tasks by priority
    const priorityOrder = {
      'critical': 0,
      'high': 1,
      'medium': 2,
      'low': 3,
      'very low': 4
    };

    formattedData.tasks.sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    return formattedData;
  } catch (error) {
    throw new Error(`Failed to format AI response: ${error.message}`);
  }
};

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProjectPlan = async (description, deadline) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert project management consultant. Create a project plan for: ${description}
    Project deadline: ${deadline.value} ${deadline.unit}
    
    Respond ONLY with a JSON object in this exact format, with no additional text like "JSON object" or explanation:
    {
      "title": "string",
      "description": "string",
      "deadline_days": number,
      "tasks": [
        {
          "title": "string",
          "description": "string",
          "duration": {
            "value": number,
            "unit": "minutes" | "hours" | "days" | "weeks" | "months" | "years"
          },
          "assigned_to": "string",
          "dependencies": ["string"],
          "priority": "critical" | "high" | "medium" | "low" | "very low",
          "status": "pending",
          "parallel_possible": boolean
        }
      ],
      "status": "active"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let cleanedResponse = response.text()
      // Remove code blocks
      .replace(/```json|```/g, '')
      // Remove "JSON" prefix if it exists
      .replace(/^JSON\s*/, '')
      // Remove any leading/trailing whitespace
      .trim();

    // If the response starts with a { character, assume it's JSON
    if (!cleanedResponse.startsWith('{')) {
      // Try to find the first { character
      const jsonStart = cleanedResponse.indexOf('{');
      if (jsonStart !== -1) {
        cleanedResponse = cleanedResponse.slice(jsonStart);
      }
    }

    // Try to find the last } character
    const jsonEnd = cleanedResponse.lastIndexOf('}');
    if (jsonEnd !== -1) {
      cleanedResponse = cleanedResponse.slice(0, jsonEnd + 1);
    }

    console.log('Cleaned response:', cleanedResponse); // Debug log

    // Parse and validate the response
    const formattedResponse = formatAIResponse(cleanedResponse);
    return formattedResponse;

  } catch (error) {
    console.error('Full error:', error);
    if (error.message.includes('Unexpected token')) {
      console.error('Raw AI response:', error.response);
      throw new Error('AI response was not in the correct JSON format. Please try again.');
    }
    throw new Error('Failed to generate project plan: ' + error.message);
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
    console.log('Received request:', req.body);

    if (!req.body.description || !req.body.deadline) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Both description and deadline are required' 
      });
    }

    let plan;
    try {
      plan = await generateProjectPlan(req.body.description, req.body.deadline);
    } catch (genError) {
      console.error('Generation error:', genError);
      return res.status(500).json({ 
        error: 'AI Plan Generation Failed',
        details: genError.message,
        suggestion: 'Please try again with a different description'
      });
    }
    
    const projectData = {
      ...plan,
      userId: req.userId,
      status: 'active',
      created_at: new Date(),
      deadline_days: plan.deadline_days || 7
    };

    const project = new Project(projectData);
    const savedProject = await project.save();
    
    console.log('Saved project:', savedProject);
    
    res.json(savedProject);
  } catch (error) {
    console.error('API endpoint error:', error);
    res.status(500).json({ 
      error: 'Server Error',
      details: error.message 
    });
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