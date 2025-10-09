import { Component, computed, OnInit, Renderer2, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  private renderer = inject(Renderer2);
  username = computed(() => this.authService.currentUser() || 'User');
  isAuthenticated = computed(() => !!this.authService.currentUser());
  currentTheme = 'light';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Sync with the theme that was already applied by the pre-load script
    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  }

  logout(): void {
    this.authService.logout();
  }

  onThemeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newTheme = target.checked ? 'synthwave' : 'light';
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: string) {
    this.currentTheme = theme;
    this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
