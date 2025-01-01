const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Debugging middleware
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

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saas-platform')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema definitions
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

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

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Auth middleware
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const generateProjectPlan = async (description) => {
  try {
    const prompt = `Create a detailed project plan for: ${description}
    Return a JSON object with tasks specifically related to this project.
    Format:
    {
      "title": "Brief, clear project title based on the description",
      "description": "Detailed project description",
      "tasks": [
        {
          "title": "Specific task name",
          "description": "Detailed task description",
          "duration_days": number between 1-30,
          "assigned_to": "Specific role for this task",
          "dependencies": ["Names of prerequisite tasks"],
          "priority": "high|medium|low",
          "status": "pending"
        }
      ],
      "deadline_days": total days needed
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a project management expert. Create custom project plans based on the user's description. Include relevant tasks and realistic timeframes."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    console.log('OpenAI generated plan:', result); // Debug log
    return result;

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // More sophisticated fallback generator based on the description
    const words = description.toLowerCase().split(' ');
    const projectType = words.includes('marketing') ? 'Marketing' :
                       words.includes('build') ? 'Construction' :
                       words.includes('develop') ? 'Development' :
                       'General';
    
    // Custom templates based on project type
    const templates = {
      Marketing: {
        title: "Marketing Campaign Project",
        tasks: [
          {
            title: "Market Research and Analysis",
            description: "Conduct market research and analyze target audience",
            duration_days: 7,
            assigned_to: "Marketing Analyst",
            dependencies: [],
            priority: "high",
            status: "pending"
          },
          {
            title: "Campaign Strategy Development",
            description: "Develop comprehensive marketing strategy and messaging",
            duration_days: 5,
            assigned_to: "Marketing Manager",
            dependencies: ["Market Research and Analysis"],
            priority: "high",
            status: "pending"
          },
          {
            title: "Content Creation",
            description: "Create marketing materials and content",
            duration_days: 10,
            assigned_to: "Content Team",
            dependencies: ["Campaign Strategy Development"],
            priority: "medium",
            status: "pending"
          }
        ],
        deadline_days: 22
      },
      Construction: {
        title: "Construction Project",
        tasks: [
          {
            title: "Design and Planning",
            description: "Create detailed designs and material requirements",
            duration_days: 5,
            assigned_to: "Project Designer",
            dependencies: [],
            priority: "high",
            status: "pending"
          },
          {
            title: "Material Procurement",
            description: "Source and purchase required materials",
            duration_days: 7,
            assigned_to: "Procurement Manager",
            dependencies: ["Design and Planning"],
            priority: "high",
            status: "pending"
          },
          {
            title: "Construction Phase",
            description: "Execute construction according to design",
            duration_days: 14,
            assigned_to: "Construction Team",
            dependencies: ["Material Procurement"],
            priority: "medium",
            status: "pending"
          }
        ],
        deadline_days: 26
      },
      Development: {
        tasks: [/* Add development-specific tasks */]
      },
      General: {
        tasks: [/* Your existing general tasks */]
      }
    };

    const template = templates[projectType];
    return {
      ...template,
      description: description,
      title: `${projectType}: ${description.slice(0, 50)}...`
    };
  }
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

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
    console.log('Generate plan request received:', req.body);
    const plan = await generateProjectPlan(req.body.description);
    const project = new Project({
      ...plan,
      userId: req.userId
    });
    const savedProject = await project.save();
    console.log('Project saved:', savedProject);
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