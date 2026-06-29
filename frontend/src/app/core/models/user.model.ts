export type UserRole = 'User' | 'Administrator';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  role?: UserRole;
}
