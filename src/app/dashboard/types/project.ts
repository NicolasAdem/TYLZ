export interface Task {
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

export interface Project {
  _id: string;
  title: string;
  description: string;
  tasks: Task[];
  deadline_days: number;
  deadline_date: string;
  created_at: string;
  status: 'active' | 'completed' | 'archived';
}

export interface Duration {
  value: number;
  unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  deadline_date?: string;
}

export interface FilterOptions {
  status: ('active' | 'completed' | 'archived' | 'all')[];
  sortBy: 'date' | 'priority' | 'deadline';
  sortOrder: 'asc' | 'desc';
}