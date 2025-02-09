"use client";

import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import ProjectList from './components/ProjectDisplay';
import ProjectModal from './components/ProjectModal';
import Navigation from './components/DashboardHeader';

import { 
  calculateDeadlineDate,
  fetchProjects,
  createProject,
  deleteProject
} from './utils';

import type { 
  Project, 
  Duration, 
  FilterOptions 
} from './types/project';

interface ModalState {
  isOpen: boolean;
  isLoading: boolean;
  description: string;
  deadline: {
    value: number;
    unit: Duration['unit'];
  };
}

export default function DashboardPage(): React.ReactElement {
  // State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    isLoading: false,
    description: '',
    deadline: { value: 1, unit: 'weeks' }
  });
  const [error, setError] = useState<string | null>(null);
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

  // Dark Mode Management
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Authentication Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.replace('/auth');
      return;
    }
    loadProjects();
  }, []);

  // Project Management Functions
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
    setModalState(prev => ({ ...prev, isLoading: true }));
    setError(null);
    
    try {
      if (!modalState.description.trim()) {
        throw new Error('Please enter a project description');
      }
      
      const deadlineDate = calculateDeadlineDate(
        modalState.deadline.value, 
        modalState.deadline.unit
      );

      const newProject = await createProject(modalState.description, {
        ...modalState.deadline,
        deadline_date: deadlineDate.toISOString()
      });
      
      setProjects(prev => [
        {
          ...newProject,
          deadline_date: deadlineDate.toISOString()
        }, 
        ...prev
      ]);
      
      setModalState({
        isOpen: false,
        isLoading: false,
        description: '',
        deadline: { value: 1, unit: 'weeks' }
      });
    } catch (err) {
      console.error('Create project error:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Failed to create project. Please try again.'}`);
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

  // Filtered Projects Computation
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];
  
    if (filterOptions.status[0] !== 'all') {
      filtered = filtered.filter(project => project.status === filterOptions.status[0]);
    }
  
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

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Animated Grid Lines */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.15] dark:opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(55 65 81) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(55 65 81) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
          animation: 'moveGrid 30s linear infinite'
        }}
      >
        <style jsx>{`
          @keyframes moveGrid {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(40px);
            }
          }

          @media (prefers-color-scheme: dark) {
            div {
              background-image: 
                linear-gradient(to right, rgb(203 213 225) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(203 213 225) 1px, transparent 1px) !important;
            }
          }
        `}</style>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Navigation 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        
        <Sidebar 
          projects={projects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          handleDeleteProject={handleDeleteProject}
        />
      
        <main className="ml-64 p-8">
          <DashboardHeader
            projects={projects}
            onCreateNew={() => setModalState(prev => ({ ...prev, isOpen: true }))}
            selectedProjectId={selectedProjectId}
            onProjectSelect={setSelectedProjectId}
          />

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <ProjectList 
            projects={filteredProjects}
            selectedProjectId={selectedProjectId}
            onProjectsUpdate={setProjects}
            handleDeleteProject={handleDeleteProject}
            setProjects={setProjects}
          />

          <ProjectModal
            showModal={modalState.isOpen}
            isLoading={modalState.isLoading}
            newProjectDescription={modalState.description}
            deadline={modalState.deadline}
            setShowModal={(isOpen: boolean) => 
              setModalState(prev => ({ ...prev, isOpen }))}
            setNewProjectDescription={(description: string) => 
              setModalState(prev => ({ ...prev, description }))}
            setDeadline={(deadline: Duration) => 
              setModalState(prev => ({ ...prev, deadline: { value: deadline.value, unit: deadline.unit } }))}
            handleCreateProject={handleCreateProject}
          />
        </main>
      </div>
    </div>
  );
}
