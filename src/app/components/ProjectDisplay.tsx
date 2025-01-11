import React, { useState, useCallback } from 'react';
import { KanbanColumn } from '../components/KanBanComponents';
import type { Project, Task } from './types';

interface ProjectDisplayProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectsUpdate: (updatedProjects: Project[]) => void;
  handleDeleteProject: (projectId: string) => Promise<void>;
}

type TaskStatus = Task['status'];

interface DraggedItem {
  task: Task;
  sourceStatus: TaskStatus;
}

const ProjectDisplay: React.FC<ProjectDisplayProps> = ({ 
  projects, 
  selectedProjectId, 
  onProjectsUpdate,
  handleDeleteProject 
}) => {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);

  const selectedProject = projects.find(p => p._id === selectedProjectId);

  const getTasksByStatus = useCallback((tasks: Task[]) => ({
    pending: tasks.filter(task => task.status === 'pending'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    completed: tasks.filter(task => task.status === 'completed')
  }), []);

  if (!selectedProject) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project._id} 
            project={project}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>
    );
  }

  const { pending, in_progress, completed } = getTasksByStatus(selectedProject.tasks);

  const columns: Array<{
    title: string;
    status: TaskStatus;
    tasks: Task[];
  }> = [
    { title: 'To Do', status: 'pending', tasks: pending },
    { title: 'In Progress', status: 'in_progress', tasks: in_progress },
    { title: 'Done', status: 'completed', tasks: completed }
  ];

  const handleDragStart = (e: React.DragEvent, task: Task, status: string) => {
    setDraggedItem({ task, sourceStatus: status as TaskStatus });
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');
    
    if (!draggedItem) return;

    const updatedProject = { ...selectedProject };
    const taskIndex = updatedProject.tasks.findIndex(t => t === draggedItem.task);
    
    if (taskIndex !== -1) {
      updatedProject.tasks[taskIndex] = {
        ...draggedItem.task,
        status: status as TaskStatus
      };
      
      onProjectsUpdate(projects.map(p => 
        p._id === selectedProject._id ? updatedProject : p
      ));
    }
    
    setDraggedItem(null);
  };

  return (
    <div className="h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{selectedProject.title}</h1>
        <p className="mt-2 text-gray-600">{selectedProject.description}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {columns.map(column => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            tasks={column.tasks}
            status={column.status}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => Promise<void>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const formatDeadlineDuration = (days: number): string => {
    if (!days) return 'No deadline set';
    return days === 1 ? '1 day' : `${days} days`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
        </div>
        <button
          onClick={() => onDelete(project._id)}
          className="p-2 bg-red-50 rounded-full hover:bg-red-100"
        >
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Deadline: {formatDeadlineDuration(project.deadline_days)}</span>
          <span>{project.tasks.length} tasks</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDisplay;