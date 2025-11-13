import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-profile-settings',
  imports: [CommonModule, ReactiveFormsModule, ConfirmationDialogComponent],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css'
})
export class ProfileSettings {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  successMessage = signal('');
  errorMessage = signal('');
  showPasswordConfirmDialog = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onUpdateUsername() {
    if (this.profileForm.valid) {
      this.successMessage.set('Username updated successfully!');
      this.errorMessage.set('');
      // TODO: Implement actual API call to update username
      console.log('Updating username to:', this.profileForm.value.username);

      setTimeout(() => {
        this.successMessage.set('');
      }, 3000);
    }
  }

  onUpdatePassword() {
    // Validate form first
    if (!this.passwordForm.valid) {
      if (this.passwordForm.hasError('passwordMismatch')) {
        this.errorMessage.set('New password and confirmation do not match!');
        this.successMessage.set('');
      }
      return;
    }

    // Clear any previous messages
    this.errorMessage.set('');
    this.successMessage.set('');

    // Show confirmation dialog
    this.showPasswordConfirmDialog.set(true);
  }

  confirmPasswordUpdate() {
    this.showPasswordConfirmDialog.set(false);

    const { oldPassword, newPassword } = this.passwordForm.value;

    this.userService.updatePassword(oldPassword, newPassword).subscribe({
      next: (response) => {
        this.successMessage.set('Password updated successfully!');
        this.errorMessage.set('');
        this.passwordForm.reset();

        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.error || 'Failed to update password. Please try again.');
        this.successMessage.set('');
      }
    });
  }

  cancelPasswordUpdate() {
    this.showPasswordConfirmDialog.set(false);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
