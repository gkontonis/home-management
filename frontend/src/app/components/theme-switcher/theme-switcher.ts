import { Component, OnInit, Renderer2, inject } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.css'
})
export class ThemeSwitcherComponent implements OnInit {
  private renderer = inject(Renderer2);
  currentTheme = 'light';

  ngOnInit() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.applyTheme(this.currentTheme);
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
