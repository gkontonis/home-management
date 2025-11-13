import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { UserDetail } from '../../../core/models/user.model';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manage-users.component.html'
})
export class ManageUsersComponent implements OnInit {
  users = signal<UserDetail[]>([]);
  filteredUsers = signal<UserDetail[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(false);

  // Modal states
  showDeleteModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  showResetPasswordModal = signal<boolean>(false);
  selectedUser = signal<UserDetail | null>(null);

  // Edit form data
  editEmail = signal<string>('');
  editRoles = signal<string[]>([]);
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.filteredUsers.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading.set(false);
      }
    });
  }

  filterUsers(): void {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      this.filteredUsers.set(this.users());
      return;
    }

    const filtered = this.users().filter(user =>
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.roles.some(role => role.toLowerCase().includes(term))
    );
    this.filteredUsers.set(filtered);
  }

  openDeleteModal(user: UserDetail): void {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
  }

  confirmDelete(): void {
    const user = this.selectedUser();
    if (!user) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    });
  }

  openEditModal(user: UserDetail): void {
    this.selectedUser.set(user);
    this.editEmail.set(user.email);
    this.editRoles.set([...user.roles]);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedUser.set(null);
    this.editEmail.set('');
    this.editRoles.set([]);
  }

  toggleRole(role: string): void {
    const roles = this.editRoles();
    if (roles.includes(role)) {
      this.editRoles.set(roles.filter(r => r !== role));
    } else {
      this.editRoles.set([...roles, role]);
    }
  }

  hasRole(role: string): boolean {
    return this.editRoles().includes(role);
  }

  saveEdit(): void {
    const user = this.selectedUser();
    if (!user) return;

    const updateRequest = {
      email: this.editEmail(),
      roles: this.editRoles()
    };

    this.userService.updateUser(user.id, updateRequest).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
      }
    });
  }

  openResetPasswordModal(user: UserDetail): void {
    this.selectedUser.set(user);
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.showResetPasswordModal.set(true);
  }

  closeResetPasswordModal(): void {
    this.showResetPasswordModal.set(false);
    this.selectedUser.set(null);
    this.newPassword.set('');
    this.confirmPassword.set('');
  }

  confirmResetPassword(): void {
    const user = this.selectedUser();
    if (!user) return;

    if (this.newPassword() !== this.confirmPassword()) {
      alert('Passwords do not match');
      return;
    }

    if (this.newPassword().length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    this.userService.resetUserPassword(user.id, this.newPassword()).subscribe({
      next: () => {
        this.closeResetPasswordModal();
        alert('Password reset successfully');
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        alert('Failed to reset password. Please try again.');
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    return role === 'ROLE_ADMIN' ? 'badge-success' : 'badge-info';
  }

  getRoleDisplay(role: string): string {
    return role.replace('ROLE_', '');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
