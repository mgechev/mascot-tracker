import { computed, Injectable, signal } from '@angular/core';

export const enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

const THEME_KEY = 'ng-mascot-theme';

@Injectable({ providedIn: 'root' })
export class Theme {
  private themeSignal = signal<ThemeMode>(this.getInitialTheme());

  readonly isDark = computed(() => {
    const currentTheme = this.themeSignal();
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem(THEME_KEY, currentTheme);
    return currentTheme === ThemeMode.DARK;
  });

  toggleTheme(): void {
    this.themeSignal.update(current => (current === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT));
  }

  private getInitialTheme(): ThemeMode {
    const savedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;

    if (savedTheme && (savedTheme === ThemeMode.LIGHT || savedTheme === ThemeMode.DARK)) {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? ThemeMode.DARK : ThemeMode.LIGHT;
  }
}
