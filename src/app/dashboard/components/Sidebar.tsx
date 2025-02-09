import React from 'react';
import { Home, Trash2 } from 'lucide-react';
import { Project } from '../types/project';

interface SidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  handleDeleteProject: (id: string) => Promise<void>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  handleDeleteProject,
}) => {
  return (
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
            className={`flex flex-col px-4 py-3 mx-4 mr-6 rounded cursor-pointer 
              transition-colors duration-200 ease-in-out group
              ${selectedProjectId === project._id 
                ? 'bg-gray-100 dark:bg-gray-700' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <div className="flex items-center flex-1 overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project._id);
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors mr-3"
              >
                <Trash2 className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-red-500" />
              </button>
              
              <div className="flex-1">
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate block">
                  {project.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};