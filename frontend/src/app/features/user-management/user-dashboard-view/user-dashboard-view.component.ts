import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { TodoService } from '../../../core/services/todo.service';
import { UserDetail } from '../../../core/models/user.model';
import { Todo } from '../../../core/models/todo.model';

@Component({
  selector: 'app-user-dashboard-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard-view.component.html'
})
export class UserDashboardViewComponent implements OnInit {
  user = signal<UserDetail | null>(null);
  todos = signal<Todo[]>([]);
  loading = signal<boolean>(false);

  // Computed statistics
  pendingCount = computed(() =>
    this.todos().filter(t => t.status === 'PENDING').length
  );

  inProgressCount = computed(() =>
    this.todos().filter(t => t.status === 'IN_PROGRESS').length
  );

  completedCount = computed(() =>
    this.todos().filter(t => t.status === 'COMPLETED').length
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private todoService: TodoService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.loadUserDashboard(+userId);
    }
  }

  loadUserDashboard(userId: number): void {
    this.loading.set(true);

    // Load user details
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.router.navigate(['/manage-users']);
      }
    });

    // Load user's todos
    this.userService.getUserTodos(userId).subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.loading.set(false);
      }
    });
  }

  backToManageUsers(): void {
    this.router.navigate(['/manage-users']);
  }

  getRoleBadgeClass(role: string): string {
    return role === 'ROLE_ADMIN' ? 'badge-success' : 'badge-info';
  }

  getRoleDisplay(role: string): string {
    return role.replace('ROLE_', '');
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge-warning';
      case 'IN_PROGRESS': return 'badge-info';
      case 'COMPLETED': return 'badge-success';
      default: return 'badge-ghost';
    }
  }

  getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'HOUSEHOLD': return 'badge-primary';
      case 'MAINTENANCE': return 'badge-warning';
      case 'GARDEN': return 'badge-success';
      case 'CLEANING': return 'badge-info';
      default: return 'badge-ghost';
    }
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString();
  }
}
