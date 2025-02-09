import React, { useState, useEffect } from 'react';
import { GripVertical, Lock } from 'lucide-react';

// Strongly typed interfaces
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
  category?: string;
  complexity?: string;
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task, status: Task['status']) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex?: number) => void;
  allTasks: Task[];
}

interface TooltipState {
  taskId: string;
  x: number;
  y: number;
}

// Task Graph implementation remains the same
class TaskGraph {
  private tasks: Map<string, Task> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();
  private unlockedTasks: Set<string> = new Set();

  constructor(tasks: Task[]) {
    this.initializeGraph(tasks);
  }

  private initializeGraph(tasks: Task[]) {
    tasks.forEach(task => {
      this.tasks.set(task.title, task);
      this.dependencyGraph.set(task.title, new Set(task.dependencies));
    });

    tasks.forEach(task => {
      if (this.canBeUnlocked(task.title)) {
        this.unlockedTasks.add(task.title);
      }
    });
  }

  private canBeUnlocked(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    if (!task.dependencies || task.dependencies.length === 0) return true;

    return task.dependencies.every(depId => {
      const depTask = this.tasks.get(depId);
      return depTask && depTask.status === 'completed';
    });
  }

  public isTaskUnlocked(taskId: string): boolean {
    return this.unlockedTasks.has(taskId);
  }

  public updateTaskStatus(taskId: string, newStatus: Task['status']): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = newStatus;
    this.tasks.set(taskId, task);

    if (newStatus === 'completed') {
      this.updateDependentTasks(taskId);
    }
  }

  private updateDependentTasks(completedTaskId: string): void {
    this.tasks.forEach((task, taskId) => {
      if (task.dependencies.includes(completedTaskId) && this.canBeUnlocked(taskId)) {
        this.unlockedTasks.add(taskId);
      }
    });
  }

  public getDependencyInfo(taskId: string): {
    isUnlocked: boolean;
    remainingDependencies: string[]
  } {
    const task = this.tasks.get(taskId);
    if (!task) return { isUnlocked: false, remainingDependencies: [] };

    const remainingDependencies = task.dependencies.filter(depId => {
      const depTask = this.tasks.get(depId);
      return !depTask || depTask.status !== 'completed';
    });

    return {
      isUnlocked: this.isTaskUnlocked(taskId),
      remainingDependencies
    };
  }
}

const getPriorityStyles = (priority: Task['priority']): { bg: string; border: string; text: string } => {
  const styles: Record<Task['priority'], { bg: string; border: string; text: string }> = {
    critical: {
      bg: 'bg-red-100 dark:bg-red-900',
      border: 'border-red-300 dark:border-red-700',
      text: 'text-red-800 dark:text-red-200'
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900',
      border: 'border-orange-300 dark:border-orange-700',
      text: 'text-orange-800 dark:text-orange-200'
    },
    medium: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      border: 'border-yellow-300 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-200'
    },
    low: {
      bg: 'bg-green-100 dark:bg-green-900',
      border: 'border-green-300 dark:border-green-700',
      text: 'text-green-800 dark:text-green-200'
    }
  };

  return styles[priority] || {
    bg: 'bg-gray-100 dark:bg-gray-900',
    border: 'border-gray-300 dark:border-gray-700',
    text: 'text-gray-800 dark:text-gray-200'
  };
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  status,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  allTasks,
}) => {
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [taskGraph] = useState(() => new TaskGraph(allTasks));
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [unlockedTasks, setUnlockedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newTaskGraph = new TaskGraph(allTasks);
    const newUnlockedTasks = new Set<string>();
    allTasks.forEach(task => {
      if (newTaskGraph.isTaskUnlocked(task.title)) {
        newUnlockedTasks.add(task.title);
      }
    });
    setUnlockedTasks(newUnlockedTasks);
  }, [allTasks]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    if (!unlockedTasks.has(task.title)) {
      e.preventDefault();
      return;
    }

    onDragStart(e, task, status);
    e.dataTransfer.setData('application/json', JSON.stringify({
      taskId: task.title,
      sourceStatus: status,
      taskData: task
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDraggedOverIndex(index);
    onDragOver(e);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedOverIndex(null);
    onDragLeave(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!data || !data.taskId) return;

      if (unlockedTasks.has(data.taskId)) {
        taskGraph.updateTaskStatus(data.taskId, status);
        
        const newUnlockedTasks = new Set(unlockedTasks);
        allTasks.forEach(task => {
          if (taskGraph.isTaskUnlocked(task.title)) {
            newUnlockedTasks.add(task.title);
          }
        });
        setUnlockedTasks(newUnlockedTasks);
        
        onDrop(e, index);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
    
    setDraggedOverIndex(null);
  };

  const showDependencyTooltip = (e: React.MouseEvent<HTMLDivElement>, taskId: string) => {
    const info = taskGraph.getDependencyInfo(taskId);
    if (!unlockedTasks.has(taskId) && info.remainingDependencies.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        taskId,
        x: rect.left,
        y: rect.top - 40
      });
    }
  };

  return (
    <div 
      className={`
        bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex-1 min-h-[500px]
        ${draggedOverIndex === -1 ? 'border-2 border-dashed border-blue-500' : ''}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggedOverIndex(-1);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDraggedOverIndex(null);
      }}
      onDrop={(e) => handleDrop(e, tasks.length)}
    >
      <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200 text-lg">{title}</h3>
      <div className="space-y-4">
        {tasks?.map((task, index) => {
          if (!task) return null; // Skip if task is undefined
          const styles = getPriorityStyles(task.priority);
          const isBeingDraggedOver = draggedOverIndex === index;
          const isUnlocked = unlockedTasks.has(task.title);
          
          return (
            <div
              key={task.title}
              draggable={isUnlocked}
              onDragStart={(e) => handleDragStart(e, task)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onMouseEnter={(e) => showDependencyTooltip(e, task.title)}
              onMouseLeave={() => setTooltip(null)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${styles.bg}
                ${styles.border}
                ${isBeingDraggedOver ? 'border-blue-500 border-dashed border-2 transform translate-y-1' : ''}
                ${isUnlocked ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-75'}
                hover:shadow-md
              `}
            >
              <div className="flex items-start gap-3">
                {isUnlocked ? (
                  <GripVertical className="mt-1 w-4 h-4 text-gray-400 dark:text-gray-500" />
                ) : (
                  <Lock className="mt-1 w-4 h-4 text-gray-400 dark:text-gray-500" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${styles.text}`}>{task.title}</h4>
                    <span className={`text-sm px-2 py-1 rounded-full ${styles.text}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {task.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-gray-500 dark:text-gray-400">
                      {task.duration.value} {task.duration.unit}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {task.assigned_to}
                    </span>
                  </div>
                </div>
              </div>

              {tooltip && tooltip.taskId === task.title && (
                <div 
                  className="absolute z-50 left-0 -top-12 w-full"
                >
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Waiting for: {taskGraph.getDependencyInfo(task.title).remainingDependencies.join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanColumn;