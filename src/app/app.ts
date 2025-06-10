import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EmojiTracker } from './emoji-tracker/emoji-tracker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, EmojiTracker],
  template: `
    <div class="app-container">
      <div class="stars"></div>
      <div class="twinkling"></div>
      <main>
        <app-emoji-tracker></app-emoji-tracker>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      position: relative;
      overflow: hidden;
    }

    .stars {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      box-shadow: 0 0 50px #fff;
      animation: animateStars 50s linear infinite;
    }

    .twinkling {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      animation: twinkle 1s ease-in-out infinite;
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
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }
  `]
})
export class App {
  title = 'mascot-tracker';
}
