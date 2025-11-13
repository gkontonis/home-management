import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService, type Theme } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  username = computed(() => this.authService.currentUser() || 'User');
  isAuthenticated = computed(() => !!this.authService.currentUser());

  constructor(
    private authService: AuthService,
    public themeService: ThemeService
  ) {}

  logout(): void {
    this.authService.logout();
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
