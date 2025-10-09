import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../../core/services/todo.service';
import { UserService } from '../../../core/services/user.service';
import { Todo, TodoStatus, TodoCategory } from '../../../core/models/todo.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoListComponent implements OnInit {
  filter = signal<string | TodoStatus>('all');
  showModal = signal(false);
  isEditing = signal(false);
  users = signal<User[]>([]);

  currentTodo: Todo = this.getEmptyTodo();

  filteredTodos = computed(() => {
    const todos = this.todoService.todos();
    const currentFilter = this.filter();

    if (currentFilter === 'all') {
      return todos;
    }

    return todos.filter(todo => todo.status === currentFilter);
  });

  constructor(
    public todoService: TodoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTodos();
    this.loadUsers();
  }

  loadTodos(): void {
    this.todoService.getMyTodos().subscribe();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users.set(users)
    });
  }

  openCreateModal(): void {
    this.currentTodo = this.getEmptyTodo();
    this.isEditing.set(false);
    this.showModal.set(true);
  }

  openEditModal(todo: Todo): void {
    this.currentTodo = { ...todo };
    this.isEditing.set(true);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveTodo(): void {
    if (this.isEditing()) {
      this.todoService.updateTodo(this.currentTodo.id!, this.currentTodo).subscribe({
        next: () => this.closeModal()
      });
    } else {
      this.todoService.createTodo(this.currentTodo).subscribe({
        next: () => this.closeModal()
      });
    }
  }

  deleteTodo(id: number): void {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(id).subscribe();
    }
  }

  countByStatus(status: TodoStatus): number {
    return this.todoService.todos().filter(t => t.status === status).length;
  }

  getStatusClass(status: TodoStatus): string {
    switch (status) {
      case 'PENDING': return 'badge-warning';
      case 'IN_PROGRESS': return 'badge-info';
      case 'COMPLETED': return 'badge-success';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  private getEmptyTodo(): Todo {
    return {
      title: '',
      description: '',
      status: 'PENDING',
      category: 'OTHER',
      assignedToId: 0,
      dueDate: null
    };
  }
}
