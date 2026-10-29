
export type TaskStatus =
  | 'To Do'
  | 'In Progress'
  | 'In Review'
  | 'Completed';

export type TaskPriority =
  | 'Low'
  | 'Medium'
  | 'High';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string;
}
