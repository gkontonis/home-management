import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly API_URL = 'http://localhost:8081/api/todos';

  // Signal for reactive todo list
  todos = signal<Todo[]>([]);

  constructor(private http: HttpClient) {}

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.API_URL)
      .pipe(tap(todos => this.todos.set(todos)));
  }

  getMyTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.API_URL}/my`)
      .pipe(tap(todos => this.todos.set(todos)));
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.API_URL, todo)
      .pipe(tap(() => this.getMyTodos().subscribe()));
  }

  updateTodo(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.API_URL}/${id}`, todo)
      .pipe(tap(() => this.getMyTodos().subscribe()));
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(tap(() => this.getMyTodos().subscribe()));
  }
}
