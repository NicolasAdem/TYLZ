"use client";

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

// Define interfaces for your data types
interface Task {
  title: string;
  description: string;
  duration_days: number;
  assigned_to: string;
  dependencies?: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

interface Project {
  _id: string;
  title: string;
  description: string;
  tasks: Task[];
  deadline_days: number;
  created_at: string;
  status: 'active' | 'completed' | 'archived';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.replace('../account');
};

const fetchProjects = async (): Promise<Project[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/projects`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};

const createProject = async (description: string): Promise<Project> => {
  const token = localStorage.getItem('token');
  
  console.log('Sending request with token:', token); // Debug log
  
  const response = await fetch(`${API_URL}/api/generate-plan`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ description })
  });
  
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create project');
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text); // Debug log
      throw new Error('Server returned an invalid response');
    }
  }
  
  return response.json();
};

const deleteProject = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/projects/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to delete project');
};

// Helper function for priority colors
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};



export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newProjectDescription, setNewProjectDescription] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.replace('/auth');
      return;
    }
    loadProjects();
  }, []);

  
  const loadProjects = async (): Promise<void> => {
    try {
      const data = await fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
    }
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!newProjectDescription.trim()) {
        throw new Error('Please enter a project description');
      }
      
      console.log('Creating project with description:', newProjectDescription); // Debug log
      
      const newProject = await createProject(newProjectDescription);
      setProjects(prev => [newProject, ...prev]);
      setShowNewProjectModal(false);
      setNewProjectDescription('');
    } catch (err) {
      console.error('Create project error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteProject = async (id: string): Promise<void> => {
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete project. Please try again.');
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="fixed w-64 h-screen bg-white shadow-lg overflow-y-auto">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-xl font-bold text-blue-600">Tylz.AI</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4 mb-2 text-sm font-medium text-gray-600">Projects</div>
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between px-4 py-2 mx-2 rounded hover:bg-gray-100 group"
            >
              <span className="text-sm text-gray-700 truncate flex-1">
                {project.title}
              </span>
              <button
                onClick={() => handleDeleteProject(project._id)}
                className="hidden group-hover:flex p-1 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
              </button>
            </div>
          ))}
            <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            New AI Project
          </button>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {project.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{task.assigned_to}</span>
                        <span>{task.duration_days} days</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Duration: {project.deadline_days} days</span>
                    <span>{project.tasks.length} tasks</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Project Modal */}
        {showNewProjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-black">Create New AI Project</h3>
              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description
                  </label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-black"
                    rows={4}
                    placeholder="Describe your project in detail (e.g., 'Create a mobile app for tracking daily fitness activities with social features and progress tracking')"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Generating Plan...' : 'Generate AI Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}