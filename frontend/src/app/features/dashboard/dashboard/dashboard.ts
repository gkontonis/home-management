import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoService } from '../../../core/services/todo.service';
import { TodoStatus } from '../../../core/models/todo.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  // Computed signals for task counts that update automatically
  pendingCount = computed(() =>
    this.todoService.todos().filter(t => t.status === 'PENDING').length
  );

  inProgressCount = computed(() =>
    this.todoService.todos().filter(t => t.status === 'IN_PROGRESS').length
  );

  completedCount = computed(() =>
    this.todoService.todos().filter(t => t.status === 'COMPLETED').length
  );

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    // Load todos when dashboard loads
    this.todoService.getMyTodos().subscribe();
  }
}
