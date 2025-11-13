import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'night' | 'forest' | 'dracula' | 'synthwave';

export interface ThemeOption {
  value: Theme;
  label: string;
  description: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly DEFAULT_THEME: Theme = 'light';

  // Available themes with metadata
  readonly availableThemes: ThemeOption[] = [
    {
      value: 'light',
      label: 'Light',
      description: 'Clean and bright',
      icon: '☀️'
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: '🌙'
    },
    {
      value: 'night',
      label: 'Night',
      description: 'Deep and comfortable',
      icon: '🌃'
    },
    {
      value: 'forest',
      label: 'Forest',
      description: 'Natural and earthy',
      icon: '🌲'
    },
    {
      value: 'dracula',
      label: 'Dracula',
      description: 'Developer favorite',
      icon: '🧛'
    },
    {
      value: 'synthwave',
      label: 'Synthwave',
      description: 'Retro cyberpunk',
      icon: '🌆'
    }
  ];

  // Current theme as a signal
  currentTheme = signal<Theme>(this.DEFAULT_THEME);

  constructor() {
    // Initialize theme from storage or use theme already set in DOM
    this.initializeTheme();

    // Persist theme changes to localStorage
    effect(() => {
      const theme = this.currentTheme();
      localStorage.setItem(this.STORAGE_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  private initializeTheme(): void {
    // Check if theme was already applied by pre-load script
    const domTheme = document.documentElement.getAttribute('data-theme');
    const storedTheme = localStorage.getItem(this.STORAGE_KEY);

    const initialTheme = (domTheme || storedTheme || this.DEFAULT_THEME) as Theme;

    // Validate theme
    if (this.isValidTheme(initialTheme)) {
      this.currentTheme.set(initialTheme);
    } else {
      this.currentTheme.set(this.DEFAULT_THEME);
    }
  }

  setTheme(theme: Theme): void {
    if (this.isValidTheme(theme)) {
      this.currentTheme.set(theme);
    }
  }

  toggleTheme(): void {
    const currentIndex = this.availableThemes.findIndex(
      t => t.value === this.currentTheme()
    );
    const nextIndex = (currentIndex + 1) % this.availableThemes.length;
    this.setTheme(this.availableThemes[nextIndex].value);
  }

  private isValidTheme(theme: string): theme is Theme {
    return this.availableThemes.some(t => t.value === theme);
  }

  getThemeOption(theme: Theme): ThemeOption | undefined {
    return this.availableThemes.find(t => t.value === theme);
  }
}
