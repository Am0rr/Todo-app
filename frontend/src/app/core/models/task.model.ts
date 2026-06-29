export type TaskItemStatus = 'Todo' | 'InProgress' | 'Done';

export interface TaskResponse {
  id: string;
  userId: string;
  categoryId?: string;
  title: string;
  description?: string;
  status: TaskItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  categoryId?: string;
  status: TaskItemStatus;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  categoryId?: string;
  status?: TaskItemStatus;
}

export interface TaskPagedResponse {
  items: TaskResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskFilterModel {
  searchTerm?: string;
  categoryId?: string;
  status?: TaskItemStatus;
  pageNumber: number;
  pageSize: number;
}
