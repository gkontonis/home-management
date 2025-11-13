export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface UserDetail extends User {
  createdAt: string;
  todoCount: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  roles?: string[];
}

export interface ResetPasswordRequest {
  newPassword: string;
}
