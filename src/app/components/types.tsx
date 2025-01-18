import React from 'react';

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

interface Project {
  _id: string;
  title: string;
  description: string;
  tasks: Task[];
  deadline_days: number;
  deadline_date: string;
  created_at: string;
  status: 'active' | 'completed' | 'archived';
}

export type TaskStatus = Task['status'];

export interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onDragStart: (e: React.DragEvent, task: Task, status: TaskStatus) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  status,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  return (
    <div
      className="bg-gray-50 p-4 rounded-lg"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
    >
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.title} // Using title as key since Task doesn't have _id
            draggable
            onDragStart={(e) => onDragStart(e, task, status)}
            className="bg-white p-3 rounded shadow cursor-move"
          >
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span className={`px-2 py-1 rounded ${
                task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {task.priority}
              </span>
              <span>
                {task.duration.value} {task.duration.unit}
              </span>
              {task.assigned_to && (
                <span>Assigned to: {task.assigned_to}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  demo: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  highlighted: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

export interface FooterColumn {
  title: string;
  links: string[];
}

export interface ResetPasswordFormData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse {
  message?: string;
  error?: string;
}

export interface FormEvent extends React.FormEvent<HTMLFormElement> {
  currentTarget: HTMLFormElement;
}