import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css'
})
export class ProfileSettings {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  successMessage = '';
  errorMessage = '';

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
      this.successMessage = 'Username updated successfully!';
      this.errorMessage = '';
      // TODO: Implement actual API call to update username
      console.log('Updating username to:', this.profileForm.value.username);

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  onUpdatePassword() {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword } = this.passwordForm.value;

      this.userService.updatePassword(oldPassword, newPassword).subscribe({
        next: (response) => {
          this.successMessage = 'Password updated successfully!';
          this.errorMessage = '';
          this.passwordForm.reset();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to update password. Please try again.';
          this.successMessage = '';
        }
      });
    } else if (this.passwordForm.hasError('passwordMismatch')) {
      this.errorMessage = 'New password and confirmation do not match!';
      this.successMessage = '';
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
