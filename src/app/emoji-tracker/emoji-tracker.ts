import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface EmojiCount {
  emoji: string;
  count: number;
  image: string;
}

interface Comment {
  body: string;
  user: {
    login: string;
  };
}

@Component({
  selector: 'app-emoji-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="emoji-tracker">
      <div class="header">
        <h1>🏆 Angular Mascot RFC Tracker 🏆</h1>
        <p class="subtitle">Vote for your <a href="https://github.com/angular/angular/discussions/61733">favorite mascot</a> design!</p>
      </div>
      
      <div class="emoji-counts">
        @for (count of emojiCounts(); track count.emoji) {
          <div class="emoji-count" [class.winner]="isWinner(count)">
            <div class="trophy" *ngIf="isWinner(count)">👑</div>
            <div class="card">
              <img [src]="count.image" [alt]="count.emoji" class="emoji-image">
              <div class="count-badge">{{ count.count }}</div>
              <div class="progress-bar">
                <div class="progress" [style.width.%]="getPercentage(count)"></div>
              </div>
              <div class="percentage">{{ getPercentage(count) }}%</div>
            </div>
          </div>
        }
      </div>

      @if (loading()) {
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
  styles: [`
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
      color: #fff;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }

    .subtitle {
      font-size: 1.2em;
      color: #666;
    }

    .subtitle a {
      color: #ff4757;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease;
    }

    .subtitle a:hover {
      color: #ff6b81;
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
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
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
      background: #ff4757;
      color: white;
      padding: 8px 15px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 1.2em;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background: #f1f2f6;
      border-radius: 5px;
      margin: 15px 0;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background: linear-gradient(90deg, #ff4757, #ff6b81);
      border-radius: 5px;
      transition: width 1s ease-in-out;
    }

    .percentage {
      font-size: 1.2em;
      font-weight: bold;
      color: #2f3542;
    }

    .loading {
      text-align: center;
      margin-top: 40px;
      color: #fff;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #ff4757;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: spin 1s linear infinite;
    }

    .error {
      text-align: center;
      margin-top: 20px;
      color: #ff4757;
      padding: 15px;
      background: #ffe0e3;
      border-radius: 8px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes winnerPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }

    @keyframes float {
      0% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-10px); }
      100% { transform: translateX(-50%) translateY(0); }
    }
  `]
})
export class EmojiTracker implements OnInit {
  emojiCounts = signal<EmojiCount[]>([]);
  loading = signal(true);
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchEmojiCounts();
  }

  isWinner(count: EmojiCount): boolean {
    const maxCount = Math.max(...this.emojiCounts().map(c => c.count));
    return count.count === maxCount && count.count > 0;
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
      '3️⃣': './3.webp'
    };
    
    ['1️⃣', '2️⃣', '3️⃣'].forEach(emoji => counts.set(emoji, 0));
    
    const fetchPage = (page: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        this.http.get<Comment[]>(`${baseUrl}?page=${page}&per_page=100`).subscribe({
          next: (comments) => {
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
            fetchPage(page + 1).then(resolve).catch(reject);
          },
          error: reject
        });
      });
    };

    fetchPage(1).then(() => {
      this.emojiCounts.set(Array.from(counts.entries()).map(([emoji, count]) => ({
        emoji,
        count,
        image: emojiToImage[emoji as keyof typeof emojiToImage]
      })));
      this.loading.set(false);
    }).catch((err) => {
      this.error = 'Failed to fetch emoji counts. Please try again later.';
      this.loading.set(false);
      console.error('Error fetching emoji counts:', err);
    });
  }
} 