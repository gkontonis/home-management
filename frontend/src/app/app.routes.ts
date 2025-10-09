import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login';
import { TodoListComponent } from './features/todos/todo-list/todo-list';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { ProfileSettings } from './features/profile-settings/profile-settings';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'todos',
    component: TodoListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile-settings',
    component: ProfileSettings,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
