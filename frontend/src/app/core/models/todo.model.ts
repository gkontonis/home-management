export type TodoStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TodoCategory = 'HOUSEHOLD' | 'MAINTENANCE' | 'GARDEN' | 'CLEANING' | 'OTHER';

export interface Todo {
  id?: number;
  title: string;
  description: string;
  status: TodoStatus;
  category: TodoCategory;
  assignedToId: number;
  assignedToUsername?: string;
  dueDate: string | null;
  createdAt?: string;
  completedAt?: string | null;
}
