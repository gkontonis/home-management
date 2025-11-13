import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  User,
  UserDetail,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest
} from '../models/user.model';
import { Todo } from '../models/todo.model';

/**
 * Service for user management operations.
 * Includes both user profile management and admin user management functions.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8081/api/users';

  // Signal for reactive user list state
  users = signal<UserDetail[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Get all users with detailed information (admin only).
   */
  getAllUsers(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(this.API_URL).pipe(
      tap(users => this.users.set(users))
    );
  }

  /**
   * Get assignable users for todo assignment.
   * Regular users see only themselves, admins see all users.
   * Available to all authenticated users.
   */
  getAssignableUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/assignable`);
  }

  /**
   * Get a specific user by ID (admin only).
   */
  getUserById(id: number): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.API_URL}/${id}`);
  }

  /**
   * Create a new user (admin only).
   */
  createUser(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.API_URL, request);
  }

  /**
   * Update a user (admin only).
   */
  updateUser(id: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Delete a user (admin only).
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Get todos for a specific user (admin only).
   */
  getUserTodos(userId: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.API_URL}/${userId}/todos`);
  }

  /**
   * Reset a user's password (admin only).
   */
  resetUserPassword(userId: number, newPassword: string): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.API_URL}/${userId}/reset-password`, {
      newPassword
    });
  }

  /**
   * Check if a username is available (admin only).
   */
  checkUsernameAvailability(username: string): Observable<{available: boolean}> {
    return this.http.get<{available: boolean}>(`${this.API_URL}/check-username`, {
      params: { username }
    });
  }

  /**
   * Update own password (any authenticated user).
   */
  updatePassword(oldPassword: string, newPassword: string): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.API_URL}/password`, {
      oldPassword,
      newPassword
    });
  }
}
