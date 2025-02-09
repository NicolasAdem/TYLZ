import { Project, Duration } from '../types/project';
import { API_URL } from './constants';

export const fetchProjects = async (): Promise<Project[]> => {
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

export const createProject = async (description: string, deadline: Duration): Promise<Project> => {
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

export const deleteProject = async (id: string): Promise<void> => {
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

export const renameProject = async (projectId: string, newTitle: string): Promise<Project> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/projects/${projectId}/rename`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: newTitle.trim() })
  });

  if (!response.ok) throw new Error('Failed to rename project');
  return response.json();
};

export const resetProject = async (projectId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/projects/${projectId}/reset`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) throw new Error('Failed to reset project');
};

export const updateTaskStatus = async (
  projectId: string, 
  taskTitle: string, 
  newStatus: string, 
  newPosition: number
): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/projects/${projectId}/tasks`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      taskTitle,
      newStatus,
      newPosition
    })
  });

  if (!response.ok) throw new Error('Failed to update task status');
};