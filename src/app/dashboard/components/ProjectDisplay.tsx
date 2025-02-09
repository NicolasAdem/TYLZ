"use client";

import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import KanbanColumn from '../../components/KanBanComponents';
import CompletionCelebration from '../../components/CompletionCelebration';
import { useSound, API_URL } from '../utils';
import { Task, Project } from '../types/project';
import { formatDeadlineDuration } from '../utils';
  

interface ProjectDisplayProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectsUpdate: (updatedProjects: Project[]) => void;
  handleDeleteProject: (projectId: string) => Promise<void>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectDisplay: React.FC<ProjectDisplayProps> = ({ 
  projects, 
  selectedProjectId, 
  onProjectsUpdate, 
  handleDeleteProject,
  setProjects
}) => {
  const playMoveSound = useSound('/tilemove.mp3');
  const playDoneSound = useSound('/tiledone.mp3');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  const handleRename = async (projectId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/rename`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle.trim() })
      });
  
      if (!response.ok) {
        throw new Error('Failed to rename project');
      }
  
      const updatedProject = await response.json();
      
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project._id === projectId 
            ? { ...project, title: updatedProject.title }
            : project
        )
      );
      
      setEditingProjectId(null);
      setEditedTitle('');
    } catch (error) {
      console.error('Failed to rename project:', error);
    }
  };
    
  const handleResetProject = async (projectId: string) => {
    const updatedProjects = projects.map(project => {
      if (project._id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task => ({
            ...task,
            status: 'pending' as const
          }))
        };
      }
      return project;
    });
    
    try {
      await fetch(`${API_URL}/api/projects/${projectId}/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      onProjectsUpdate(updatedProjects);
      playMoveSound();
    } catch (error) {
      console.error('Failed to reset project:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task, status: Task['status']) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      taskId: task.title,
      sourceStatus: status,
      taskData: task
    }));
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: Task['status'], projectId: string) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!data || !data.taskId) return;
  
      const tasksInColumn = projects
        .find(p => p._id === projectId)
        ?.tasks.filter(t => t.status === status) || [];
      const newPosition = tasksInColumn.length;
  
      const updatedProjects = projects.map(project => {
        if (project._id === projectId) {
          const updatedTasks = project.tasks.map(task => 
            task.title === data.taskId
              ? { ...task, status, position: newPosition }
              : task
          );
  
          if (status === 'completed') {
            playDoneSound();
          } else {
            playMoveSound();
          }
  
          if (updatedTasks.every(task => task.status === 'completed')) {
            setShowCelebration(true);
          }
  
          return { ...project, tasks: updatedTasks };
        }
        return project;
      });
  
      await fetch(`${API_URL}/api/projects/${projectId}/tasks`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskTitle: data.taskId,
          newStatus: status,
          newPosition: newPosition
        })
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
      {displayedProjects.map((project) => (
        <div key={project._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-grow">
                {editingProjectId === project._id ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRename(project._id, editedTitle);
                    }}
                    className="flex items-center"
                  >
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:border-blue-500"
                      autoFocus
                      onBlur={() => {
                        if (editedTitle.trim()) {
                          handleRename(project._id, editedTitle);
                        }
                        setEditingProjectId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setEditingProjectId(null);
                          setEditedTitle('');
                        }
                      }}
                    />
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingProjectId(project._id);
                        setEditedTitle(project.title);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {project.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResetProject(project._id)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  title="Reset project"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              {(['pending', 'in_progress', 'completed'] as const).map((columnStatus) => (
                <KanbanColumn
                  key={columnStatus}
                  title={columnStatus === 'pending' ? 'To Do' : 
                         columnStatus === 'in_progress' ? 'In Progress' : 'Done'}
                  tasks={project.tasks.filter(task => task.status === columnStatus)}
                  status={columnStatus}
                  onDragStart={handleDragStart}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, columnStatus, project._id)}
                  allTasks={project.tasks}
                />
              ))}
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
      {showCelebration && (
        <CompletionCelebration 
          show={showCelebration}
          onDeleteProject={() => {
            const currentProject = displayedProjects[0];
            if (currentProject) {
              handleDeleteProject(currentProject._id);
              setShowCelebration(false);
            }
          }}
          onKeepProject={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
};

export default ProjectDisplay;