"use client";

import { useState, useEffect, Dispatch, SetStateAction, useMemo} from 'react';
import { Trash2, Home, Fish, Settings } from 'lucide-react';
import Loader from '../components/Loader';
import KanbanColumn from '../components/KanBanComponents';
import Navigation from '../components/Top';
import CompletionCelebration from '../components/CompletionCelebration';
import DashboardHeader from '../components/DashboardHeader';

interface Task {
  title: string;
  description: string;
  duration: {
    value: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks'
  };
  assigned_to: string;
  dependencies: string[]; 
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  parallel_possible?: boolean;
  category?: string;
  complexity?: string;
  subtasks?: {
    description: string;
    duration: {
      value: number;
      unit: string;
    }
  }[];
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

interface ProjectDisplayProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectsUpdate: (updatedProjects: Project[]) => void;
  handleDeleteProject: (projectId: string) => Promise<void>;
  setProjects: Dispatch<SetStateAction<Project[]>>; 
}

interface FilterOptions {
  status: ('active' | 'completed' | 'archived' | 'all')[];  // Added 'all' as a possible value
  sortBy: 'date' | 'priority' | 'deadline';
  sortOrder: 'asc' | 'desc';
}

interface Duration {
  value: number;
  unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const formatTitle = (title: string): string => {
  return title.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
};

const formatDeadlineDuration = (project: Project): string => {
  if (!project.deadline_days) return 'No deadline set';
  return project.deadline_days === 1 ? '1 day' : `${project.deadline_days} days`;
};

const getPriorityStyles = (priority: string): { bg: string; border: string; text: string } => {
  switch(priority.toLowerCase()) {
    case 'critical':
      return {
        bg: 'bg-red-100',
        border: 'border-red-300',
        text: 'text-red-800'
      };
    case 'high':
      return {
        bg: 'bg-orange-100',
        border: 'border-orange-300',
        text: 'text-orange-800'
      };
    case 'medium':
      return {
        bg: 'bg-yellow-100',
        border: 'border-yellow-300',
        text: 'text-yellow-800'
      };
    case 'low':
      return {
        bg: 'bg-green-100',
        border: 'border-green-300',
        text: 'text-green-800'
      };
    default:
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-800'
      };
  }
};

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

const createProject = async (description: string, deadline: Duration): Promise<Project> => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        description, 
        deadline: {
          value: Number(deadline.value),
          unit: deadline.unit
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to create project');
    }

    return response.json();
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
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

const getMaxValueForUnit = (unit: string): number => {
  const maxValues: { [key: string]: number } = {
    minutes: 59,
    hours: 23,
    days: 31,
    weeks: 51,
    months: 12,
    years: 10
  };
  return maxValues[unit] || 999;
};

const ProjectDisplay: React.FC<ProjectDisplayProps> = ({ 
  projects, 
  selectedProjectId, 
  onProjectsUpdate, 
  handleDeleteProject,
  setProjects
}) => {
  // Rest of the component stays the same
  const [draggedTask, setDraggedTask] = useState<{task: Task, status: string} | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const handleDragStart = (e: React.DragEvent, task: Task, status: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      taskId: task.title,
      sourceStatus: status,
      taskData: task
    }));
    setDraggedTask({ task, status });
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    // No additional handling needed for drag leave
  };

  const handleDrop = (
    e: React.DragEvent, 
    dropStatus: 'pending' | 'in_progress' | 'completed', 
    projectId: string
  ): void => {
    e.preventDefault();
    
    try {
      const dragData = e.dataTransfer.getData('application/json');
      const data = JSON.parse(dragData);
      
      if (!data || !data.taskId) return;
      
      const updatedProjects = projects.map(project => {
        if (project._id === projectId) {
          const taskIndex = project.tasks.findIndex(t => t.title === data.taskId);
          if (taskIndex === -1) return project;
  
          const updatedTasks = [...project.tasks];
          const [movedTask] = updatedTasks.splice(taskIndex, 1);
          const updatedTask = { ...movedTask, status: dropStatus };
          updatedTasks.push(updatedTask);
  
          // Check if ALL tasks are completed
          if (updatedTasks.every(task => task.status === 'completed')) {
            setShowCelebration(true);
          }
  
          return {
            ...project,
            tasks: updatedTasks
          };
        }
        return project;
      });
  
      onProjectsUpdate(updatedProjects);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
    
  const displayedProjects = selectedProjectId
    ? projects.filter(project => project._id === selectedProjectId)
    : projects;

  return (
    <div className="grid grid-cols-1 gap-6">
    {displayedProjects.map((project: Project) => (
      <div key={project._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{project.description}</p>
              </div>
              <button
                onClick={() => handleDeleteProject(project._id)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4">
              {['pending', 'in_progress', 'completed'].map((columnStatus) => (
                <KanbanColumn
                  key={columnStatus}
                  title={columnStatus === 'pending' ? 'To Do' : 
                         columnStatus === 'in_progress' ? 'In Progress' : 'Done'}
                  tasks={project.tasks.filter(task => task.status === columnStatus)}
                  status={columnStatus as 'pending' | 'in_progress' | 'completed'}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, columnStatus as 'pending' | 'in_progress' | 'completed', project._id)}
                  allTasks={project.tasks}
                />
              ))}
              <CompletionCelebration 
                show={showCelebration}
                onDeleteProject={() => {
                  const currentProject = displayedProjects[0];
                  if (currentProject) {
                    handleDeleteProject(currentProject._id);
                    setShowCelebration(false);
                  }
                }}
                onKeepProject={() => {
                  setShowCelebration(false);
                }}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Deadline: {formatDeadlineDuration(project)}</span>
                <span>{project.tasks.length} tasks</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage(): React.ReactElement {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<Duration>({ value: 1, unit: 'weeks' });
  const [newProjectDescription, setNewProjectDescription] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: ['all'],
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? savedMode === 'true' : 
              window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

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

  const handleTasksUpdate = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
  };

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];
  
    // Apply status filter
    if (filterOptions.status[0] !== 'all') {
      filtered = filtered.filter(project => project.status === filterOptions.status[0]);
    }
  
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filterOptions.sortBy) {
        case 'date':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'deadline':
          comparison = a.deadline_days - b.deadline_days;
          break;
        case 'priority':
          const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
          const aPriority = Math.max(...a.tasks.map(t => priorityOrder[t.priority] || 0));
          const bPriority = Math.max(...b.tasks.map(t => priorityOrder[t.priority] || 0));
          comparison = bPriority - aPriority;
          break;
      }
      return filterOptions.sortOrder === 'asc' ? comparison : -comparison;
    });
  
    return filtered;
  }, [projects, filterOptions]);
  
  const handleFilterChange = (options: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...options
    }));
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!newProjectDescription.trim()) {
        throw new Error('Please enter a project description');
      }
      
      const newProject = await createProject(newProjectDescription, deadline);
      setProjects(prev => [newProject, ...prev]);
      setShowNewProjectModal(false);
      setNewProjectDescription('');
      setDeadline({ value: 1, unit: 'weeks' });
    } catch (err) {
      console.error('Create project error:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Failed to create project. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
    const handleDeleteProject = async (id: string): Promise<void> => {
      try {
        await deleteProject(id);
        setProjects(prev => prev.filter(p => p._id !== id));
        if (selectedProjectId === id) {
          setSelectedProjectId(null);
        }
      } catch (err) {
        setError('Failed to delete project. Please try again.');
        console.error('Delete error:', err);
      }
    };
  
    return (
      <div className="transition-colors duration-200 ease-in-out bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navigation isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        {/* Sidebar */}
        <aside className="fixed w-64 h-screen transition-colors duration-200 ease-in-out bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
          <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Tylz.AI</h1>
          </div>
  
          <nav className="mt-6">
            <div 
              className={`flex items-center px-4 py-2 mx-4 mr-6 rounded cursor-pointer
                transition-colors duration-200 ease-in-out
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${!selectedProjectId ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
              onClick={() => setSelectedProjectId(null)}
            >
              <Home className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-600 dark:text-blue-400">All projects</span>
            </div>
  
            <div className="px-4 mt-4 mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Projects
            </div>
            
            {projects.map((project) => (
              <div
              key={project._id}
              onClick={() => setSelectedProjectId(project._id)}
              className={`flex items-center justify-between px-4 py-2 mx-4 mr-6 rounded cursor-pointer 
                transition-colors duration-200 ease-in-out
                hover:bg-gray-100 dark:hover:bg-gray-700 group
                ${selectedProjectId === project._id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
            >
              <div className="flex items-center flex-1 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project._id);
                  }}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded mr-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-red-500" />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate pr-2">
                  {project.title}
                </span>
              </div>
            </div>
            ))}
          </nav>
        </aside>
  
      {/* Main Content */}
      <main className="ml-64 p-8">
      <DashboardHeader
        projects={projects}
        onCreateNew={() => setShowNewProjectModal(true)}
        selectedProjectId={selectedProjectId}
        onProjectSelect={setSelectedProjectId}
      />

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <ProjectDisplay 
          projects={filteredProjects}
          selectedProjectId={selectedProjectId}
          onProjectsUpdate={handleTasksUpdate}
          handleDeleteProject={handleDeleteProject}
          setProjects={setProjects}
        />
  
          {/* New Project Modal */}
          {showNewProjectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full transition-colors duration-200">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create New AI Project</h3>
                <form onSubmit={handleCreateProject}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Description
                    </label>
                    <textarea
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                      rows={4}
                      placeholder="Describe your project in detail..."
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Deadline
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="1"
                        max={getMaxValueForUnit(deadline.unit)}
                        value={deadline.value}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          const maxValue = getMaxValueForUnit(deadline.unit);
                          setDeadline({
                            ...deadline,
                            value: Math.min(Math.max(1, newValue), maxValue)
                          });
                        }}
                        className="w-20 px-3 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        required
                      />
                      <select
                        value={deadline.unit}
                        onChange={(e) => setDeadline({...deadline, unit: e.target.value as Duration['unit']})}
                        className="px-3 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>
  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowNewProjectModal(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      Generate AI Plan
                    </button>
                  </div>
                </form>
                {isLoading && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
  
  