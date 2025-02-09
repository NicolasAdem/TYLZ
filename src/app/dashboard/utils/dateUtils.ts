import { Project } from '../types/project';

export const formatDeadlineDuration = (project: Project): string => {
  if (!project.deadline_date) return 'No deadline set';
  
  const deadline = new Date(project.deadline_date);
  const now = new Date();
  const diffTime = Math.abs(deadline.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (deadline < now) {
    return `Overdue by ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  }
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
};

export const calculateDeadlineDate = (value: number, unit: string): Date => {
  const date = new Date();
  switch (unit) {
    case 'minutes':
      date.setMinutes(date.getMinutes() + value);
      break;
    case 'hours':
      date.setHours(date.getHours() + value);
      break;
    case 'days':
      date.setDate(date.getDate() + value);
      break;
    case 'weeks':
      date.setDate(date.getDate() + (value * 7));
      break;
    case 'months':
      date.setMonth(date.getMonth() + value);
      break;
    case 'years':
      date.setFullYear(date.getFullYear() + value);
      break;
  }
  return date;
};