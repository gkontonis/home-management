import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { CreateUserRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent implements OnInit {
  userForm!: FormGroup;
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_]+$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      isAdmin: [false]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get username() { return this.userForm.get('username'); }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  get confirmPassword() { return this.userForm.get('confirmPassword'); }
  get isAdmin() { return this.userForm.get('isAdmin'); }

  getPasswordStrength(): string {
    const password = this.password?.value || '';
    if (password.length === 0) return '';
    if (password.length < 8) return 'Weak';
    if (password.length < 12) return 'Medium';
    return 'Strong';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength === 'Weak') return 'text-error';
    if (strength === 'Medium') return 'text-warning';
    if (strength === 'Strong') return 'text-success';
    return '';
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const formValue = this.userForm.value;
    const roles = formValue.isAdmin ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER'];

    const request: CreateUserRequest = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      roles: roles
    };

    this.userService.createUser(request).subscribe({
      next: () => {
        this.router.navigate(['/manage-users']);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Error creating user:', error);

        if (error.status === 400 && error.error?.message) {
          this.errorMessage.set(error.error.message);
        } else if (error.error?.error) {
          this.errorMessage.set(error.error.error);
        } else {
          this.errorMessage.set('Failed to create user. Please try again.');
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/manage-users']);
  }
}
