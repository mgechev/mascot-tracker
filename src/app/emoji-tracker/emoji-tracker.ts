import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EmojiCard} from '../emoji-card/emoji-card';
import {EmojiCount} from '../models/emoji-count.model';
import {Comment} from '../models/comment.model';

@Component({
  selector: 'app-emoji-tracker',
  imports: [EmojiCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="emoji-tracker">
      <div class="header">
        <h1>🏆 Angular Mascot RFC Tracker 🏆</h1>
        <p class="subtitle">
          Vote for your <a href="https://github.com/angular/angular/discussions/61733">favorite mascot</a> design!
        </p>
      </div>

      <!-- Podium for top three emojis -->
      @if (emojiCounts().length >= 3) {
        <div class="podium-container">
          <!-- Second place (left) -->
          <div class="podium-item podium-second">
            <div class="trophy">🥈</div>
            <app-emoji-card
              [emojiData]="topThreeEmojis()[1]"
              [percentage]="getPercentage(topThreeEmojis()[1])"
              [size]="180"
              podiumPosition="second"
            >
            </app-emoji-card>
          </div>

          <!-- First place (middle) -->
          <div class="podium-item podium-first">
            <div class="trophy">👑</div>
            <app-emoji-card
              [emojiData]="topThreeEmojis()[0]"
              [percentage]="getPercentage(topThreeEmojis()[0])"
              [size]="220"
              podiumPosition="first"
            >
            </app-emoji-card>
          </div>

          <!-- Third place (right) -->
          <div class="podium-item podium-third">
            <div class="trophy">🥉</div>
            <app-emoji-card
              [emojiData]="topThreeEmojis()[2]"
              [percentage]="getPercentage(topThreeEmojis()[2])"
              [size]="160"
              podiumPosition="third"
            >
            </app-emoji-card>
          </div>
        </div>
      }

      @if (emojiCounts().length > 0) {
        <p class="disclaimer">
          This vote tally reflects the current community feedback on the initial mascot concepts.<br />
          The results will be used to inform and iterate on further designs before a final mascot is officially chosen.
        </p>
      }
      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Counting unique votes...</p>
        </div>
      }
      @if (error()) {
        <div class="error">{{ error() }}</div>
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

      /* Podium styles */
      .podium-container {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin: 60px auto;
        max-width: 900px;
        position: relative;
      }

      .podium-item {
        position: relative;
        transition: transform 0.3s ease;
        margin: 0 15px;
      }

      .podium-item:hover {
        transform: scale(1.05);
      }

      .podium-first {
        order: 2;
        z-index: 3;
        transform: translateY(-20px);
      }

      .podium-first:hover {
        transform: scale(1.05) translateY(-20px);
      }

      /* Card styles moved to emoji-card component */

      .podium-second {
        order: 1;
        z-index: 2;
      }

      /* Card styles moved to emoji-card component */

      .podium-third {
        order: 3;
        z-index: 1;
      }

      /* Card styles moved to emoji-card component */

      .podium-item .trophy {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 2em;
        z-index: 1;
      }

      .podium-first .trophy {
        font-size: 2.5em;
      }

      .trophy {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 2em;
        z-index: 1;
      }

      /* Card styles moved to emoji-card component */

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

      /* Responsive styles */
      @media (max-width: 992px) {
        .emoji-tracker {
          padding: 15px;
        }

        .header h1 {
          font-size: 2em;
        }

        .subtitle {
          font-size: 1.1em;
        }

        .podium-container {
          margin: 40px auto;
        }
      }

      @media (max-width: 768px) {
        .header h1 {
          font-size: 1.8em;
        }

        .subtitle {
          font-size: 1em;
        }

        .podium-container {
          margin: 30px auto;
        }

        .podium-item {
          margin: 0 10px;
        }

        .trophy {
          font-size: 1.8em;
        }

        .podium-first .trophy {
          font-size: 2.2em;
        }

        .disclaimer {
          font-size: 0.9em;
        }
      }

      @media (max-width: 576px) {
        .emoji-tracker {
          padding: 10px;
        }

        .header {
          margin-bottom: 20px;
        }

        .header h1 {
          font-size: 1.5em;
        }

        .podium-container {
          flex-direction: column;
          align-items: center;
          margin: 20px auto;
        }

        .podium-item {
          margin: 15px 0;
        }

        .podium-first {
          order: 1;
          transform: none;
        }

        .podium-second {
          order: 2;
          transform: none;
        }

        .podium-third {
          order: 3;
          transform: none;
        }

        .podium-first:hover {
          transform: scale(1.05);
        }

        .podium-item .trophy {
          top: -15px;
          font-size: 1.5em;
        }

        .podium-first .trophy {
          font-size: 1.8em;
        }

        .disclaimer {
          font-size: 0.8em;
          margin-top: 20px;
        }
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
    `,
  ],
})
export class EmojiTracker implements OnInit {
  private readonly http = inject(HttpClient);

  emojiCounts = signal<EmojiCount[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Get top three emojis sorted by count as a computed signal
  topThreeEmojis = computed(() => {
    return [...this.emojiCounts()].sort((a, b) => b.count - a.count).slice(0, 3);
  });

  ngOnInit() {
    this.fetchEmojiCounts();
  }

  getPercentage(count: EmojiCount): number {
    const total = this.emojiCounts().reduce((sum, c) => sum + c.count, 0);
    return total > 0 ? Math.round((count.count / total) * 100) : 0;
  }

  private fetchEmojiCounts() {
    const baseUrl = 'https://api.github.com/repos/angular/angular/discussions/61733/comments';
    const counts = new Map<string, number>();
    const userVotes = new Map<string, string>(); // Map of username to their vote
    const emojiToImage = {
      '1️⃣': './1.webp',
      '2️⃣': './2.webp',
      '3️⃣': './3.webp',
    };

    ['1️⃣', '2️⃣', '3️⃣'].forEach(emoji => counts.set(emoji, 0));

    const fetchPage = (page: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        this.http.get<Comment[]>(`${baseUrl}?page=${page}&per_page=100`).subscribe({
          next: comments => {
            if (comments.length === 0) {
              resolve();
              return;
            }

            comments.forEach(comment => {
              const username = comment.user.login;
              const body = comment.body;

              // Check if user has already voted
              if (userVotes.has(username)) {
                return; // Skip if user already voted
              }

              // Find the first emoji in the comment
              const emoji = ['1️⃣', '2️⃣', '3️⃣'].find(e => body.includes(e));
              if (emoji) {
                userVotes.set(username, emoji);
                counts.set(emoji, (counts.get(emoji) || 0) + 1);
              }
            });

            // Fetch next page
            fetchPage(page + 1)
              .then(resolve)
              .catch(reject);
          },
          error: reject,
        });
      });
    };

    fetchPage(1)
      .then(() => {
        this.emojiCounts.set(
          Array.from(counts.entries()).map(([emoji, count]) => ({
            emoji,
            count,
            image: emojiToImage[emoji as keyof typeof emojiToImage],
          }))
        );
        this.loading.set(false);
      })
      .catch(err => {
        this.error.set('Failed to fetch emoji counts. Please try again later.');
        this.loading.set(false);
        console.error('Error fetching emoji counts:', err);
      });
  }
}
