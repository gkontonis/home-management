import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeSwitcherComponent as ThemeSwitcher } from '../../../components/theme-switcher/theme-switcher';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeSwitcher],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  username = computed(() => this.authService.currentUser() || 'User');

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  changeTheme(event: Event) {
    const theme = (event.target as HTMLSelectElement).value;
    document.documentElement.setAttribute('data-theme', theme);
  }
}
