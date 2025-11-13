import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../../core/services/todo.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Todo, TodoStatus, TodoCategory } from '../../../core/models/todo.model';
import { User } from '../../../core/models/user.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoListComponent implements OnInit {
  filter = signal<string | TodoStatus>('all');
  showModal = signal(false);
  isEditing = signal(false);
  users = signal<User[]>([]);

  // Admin-specific features
  viewMode = signal<'my' | 'all'>('my');
  isAdmin = computed(() => this.authService.isAdmin());

  // Delete confirmation
  showDeleteDialog = signal(false);
  todoToDelete = signal<Todo | null>(null);
  deleteMessage = computed(() => {
    const todo = this.todoToDelete();
    const title = todo?.title || 'this todo';
    return `Are you sure you want to delete "${title}"? This action cannot be undone.`;
  });

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
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTodos();
    this.loadUsers();
  }

  loadTodos(): void {
    const mode = this.viewMode();

    if (mode === 'all' && this.isAdmin()) {
      this.todoService.getAllTodos().subscribe();
    } else {
      this.todoService.getMyTodos().subscribe();
    }
  }

  toggleViewMode(): void {
    const newMode = this.viewMode() === 'my' ? 'all' : 'my';
    this.viewMode.set(newMode);
    this.loadTodos();
  }

  loadUsers(): void {
    this.userService.getAssignableUsers().subscribe({
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

  deleteTodo(todo: Todo): void {
    this.todoToDelete.set(todo);
    this.showDeleteDialog.set(true);
  }

  confirmDelete(): void {
    const todo = this.todoToDelete();
    if (todo && todo.id) {
      this.todoService.deleteTodo(todo.id).subscribe({
        next: () => {
          this.showDeleteDialog.set(false);
          this.todoToDelete.set(null);
        },
        error: () => {
          this.showDeleteDialog.set(false);
          this.todoToDelete.set(null);
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.todoToDelete.set(null);
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
