import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './features/auth/login/login';
import { TodoListComponent } from './features/todos/todo-list/todo-list';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { ProfileSettings } from './features/profile-settings/profile-settings';
import { ManageUsersComponent } from './features/user-management/manage-users/manage-users.component';
import { CreateUserComponent } from './features/user-management/create-user/create-user.component';
import { UserDashboardViewComponent } from './features/user-management/user-dashboard-view/user-dashboard-view.component';

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
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'users/:userId/dashboard',
    component: UserDashboardViewComponent,
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: '/login' }
];
