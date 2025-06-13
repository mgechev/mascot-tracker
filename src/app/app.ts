import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmojiTracker } from './emoji-tracker/emoji-tracker';
import { ThemeToggle } from './theme/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [EmojiTracker, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-container">
      <div class="stars"></div>
      <div class="twinkling"></div>
      <header class="app-header">
        <app-theme-toggle />
      </header>
      <main>
        <app-emoji-tracker />
      </main>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        background: var(--bg-secondary);
        position: relative;
        overflow: hidden;
      }

      .app-header {
        display: flex;
        justify-content: flex-end;
        padding: 1rem 2rem;
        position: relative;
        z-index: 2;
      }

      .stars {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        box-shadow: 0 0 50px var(--text-color);
        animation: animateStars 50s linear infinite;
        opacity: 0.5;
      }

      .twinkling {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        animation: twinkle 1s ease-in-out infinite;
        opacity: 0.3;
      }

      main {
        position: relative;
        z-index: 1;
        padding: 20px;
      }

      @keyframes animateStars {
        from {
          transform: translateY(0);
        }
        to {
          transform: translateY(-2000px);
        }
      }

      @keyframes twinkle {
        0% {
          opacity: 0.5;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.5;
        }
      }
    `,
  ],
})
export class App {}
