import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Theme } from './services/theme';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      class="theme-toggle"
      (click)="theme.toggleTheme()"
      [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      @if (theme.isDark()) {
        <span class="toggle-icon">☀️</span>
        <span class="toggle-text">Light Mode</span>
      } @else {
        <span class="toggle-icon">🌙</span>
        <span class="toggle-text">Dark Mode</span>
      }
    </button>
  `,
  styles: [
    `
      .theme-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        background: transparent;
        border: 2px solid currentColor;
        border-radius: 20px;
        padding: 8px 16px;
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .theme-toggle:hover {
        background: var(--hover-bg);
      }

      .toggle-icon {
        font-size: 1.2em;
      }

      .toggle-text {
        font-size: 0.9em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected readonly theme = inject(Theme);
}
