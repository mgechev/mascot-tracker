import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EmojiTrackerService } from './emoji-tracker-service';

@Component({
  selector: 'app-emoji-tracker',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let emojiCounts = emojiCountsResource.value();
    @let isLoading = emojiCountsResource.isLoading();
    @let error = emojiCountsResource.error();

    <div class="emoji-tracker">
      <div class="header">
        <h1>🏆 Angular Mascot RFC Tracker 🏆</h1>
        <p class="subtitle">
          Vote for your <a href="https://github.com/angular/angular/discussions/61733">favorite mascot</a> design!
        </p>
      </div>

      <div class="emoji-counts">
        @for (emoji of emojiCounts; track emoji.emoji) {
          <div class="emoji-count" [class.winner]="emoji.isWinner">
            @if (emoji.isWinner) {
              <div class="trophy">👑</div>
            }
            <div class="card">
              <img [ngSrc]="emoji.image" [alt]="emoji.emoji" class="emoji-image" height="200" width="200" />
              <div class="count-badge">{{ emoji.count }}</div>
              <div class="progress-bar">
                <div class="progress" [style.width.%]="emoji.percentage"></div>
              </div>
              <div class="percentage">{{ emoji.percentage }}%</div>
            </div>
          </div>
        }
      </div>

      @if (emojiCounts.length > 0) {
        <p class="disclaimer">
          This vote tally reflects the current community feedback on the initial mascot concepts.<br />
          The results will be used to inform and iterate on further designs before a final mascot is officially chosen.
        </p>
      }
      @if (isLoading) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Counting unique votes...</p>
        </div>
      }
      @if (error) {
        <div class="error">{{ error }}</div>
      }
    </div>
  `,
  styles: [
    `
      .emoji-tracker {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
        font-family: 'Inter', sans-serif;
      }

      .header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeIn 0.5s ease-in;
      }

      .header h1 {
        font-size: 2.5em;
        color: var(--text-color);
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      }

      .subtitle {
        font-size: 1.2em;
        color: var(--text-secondary);
      }

      .subtitle a {
        color: var(--accent-color);
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s ease;
      }

      .subtitle a:hover {
        color: var(--accent-hover);
        text-decoration: underline;
      }

      .emoji-counts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        justify-content: center;
        margin-top: 20px;
      }

      .emoji-count {
        position: relative;
        transition: transform 0.3s ease;
      }

      .emoji-count:hover {
        transform: translateY(-5px);
      }

      .emoji-count.winner {
        animation: winnerPulse 2s infinite;
      }

      .trophy {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 2em;
        z-index: 1;
        animation: float 3s ease-in-out infinite;
      }

      .card {
        background: var(--card-bg);
        border-radius: 15px;
        padding: 20px;
        box-shadow: var(--card-shadow);
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        overflow: hidden;
      }

      .emoji-image {
        width: 200px;
        height: 200px;
        object-fit: contain;
        margin-bottom: 15px;
        transition: transform 0.3s ease;
      }

      .emoji-count:hover .emoji-image {
        transform: scale(1.05);
      }

      .count-badge {
        position: absolute;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 1.2em;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .progress-bar {
        width: 100%;
        height: 10px;
        background: var(--progress-bg);
        border-radius: 5px;
        margin: 15px 0;
        overflow: hidden;
      }

      .progress {
        height: 100%;
        background: var(--progress-fill);
        border-radius: 5px;
        transition: width 1s ease-in-out;
      }

      .percentage {
        font-size: 1.2em;
        font-weight: bold;
        color: var(--text-color);
      }

      .loading {
        text-align: center;
        margin-top: 40px;
        color: var(--text-color);
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid var(--spinner-border);
        border-top: 5px solid var(--spinner-border-top);
        border-radius: 50%;
        margin: 0 auto 20px;
        animation: spin 1s linear infinite;
      }

      .error {
        text-align: center;
        margin-top: 20px;
        color: var(--accent-color);
        padding: 15px;
        background: rgba(255, 71, 87, 0.1);
        border-radius: 8px;
      }

      .disclaimer {
        margin-top: 30px;
        text-align: center;
        color: var(--text-color);
        opacity: 0.7;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes winnerPulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.02);
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes float {
        0% {
          transform: translateX(-50%) translateY(0);
        }
        50% {
          transform: translateX(-50%) translateY(-10px);
        }
        100% {
          transform: translateX(-50%) translateY(0);
        }
      }
    `,
  ],
})
export class EmojiTracker {
  private readonly emojiTrackerService = inject(EmojiTrackerService);

  emojiCountsResource = this.emojiTrackerService.getEmojiTrackerResource();
}
