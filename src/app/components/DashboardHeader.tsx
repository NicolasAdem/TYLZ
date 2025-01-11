import React from 'react';
import { PlusCircle, Layout } from 'lucide-react';

interface Project {
  _id: string;
  status: string;
  tasks: { status: string }[];
  title?: string;
  description?: string;
}

interface DashboardHeaderProps {
  projects: Project[];
  onCreateNew: () => void;
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string | null) => void;
}

const EmptyState = ({ onCreateNew }: { onCreateNew: () => void }) => (
  <div className="text-center p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
    <div className="mx-auto max-w-md">
      <Layout className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No projects yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Get started by creating your first AI-powered project.
      </p>
      <button
        onClick={onCreateNew}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Create New Project
      </button>
    </div>
  </div>
);

const CustomToggle = ({ projects, selectedProjectId, onProjectSelect }: {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string | null) => void;
}) => (
  <div className="relative inline-block">
    <select 
      value={selectedProjectId || ''} 
      onChange={(e) => onProjectSelect(e.target.value || null)}
      className="appearance-none px-4 py-2 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">All Projects</option>
      {projects.map((project) => (
        <option key={project._id} value={project._id}>
          {project.title}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
      </svg>
    </div>
  </div>
);

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  projects, 
  onCreateNew,
  selectedProjectId,
  onProjectSelect
}) => {
  const stats = {
    active: projects.filter(p => p.status === 'active' && p.tasks.some(t => t.status !== 'completed')).length,
    completed: projects.filter(p => p.status === 'completed' || p.tasks.every(t => t.status === 'completed')).length,
    totalTasks: projects.reduce((acc, project) => acc + project.tasks.length, 0),
    completedTasks: projects.reduce((acc, project) => 
      acc + project.tasks.filter(task => task.status === 'completed').length, 0
    )
  };

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects Dashboard
          </h2>
        </div>
        
        {projects.length > 0 && (
          <div className="flex items-center space-x-3">
            <CustomToggle 
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectSelect={onProjectSelect}
            />
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              <span>New Project</span>
            </button>
          </div>
        )}
      </div>

      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Projects</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.active}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Completed Projects</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.completed}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.totalTasks}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Completed Tasks</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.completedTasks}
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 && <EmptyState onCreateNew={onCreateNew} />}
    </div>
  );
};

export default DashboardHeader;