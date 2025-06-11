import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, expand, filter, map, of, takeLast, throwError } from 'rxjs';

interface Comment {
  body: string;
  user: {
    login: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class EmojiTrackerService {
  private readonly httpClient = inject(HttpClient);
  private counts = new Map<string, number>([
    ['1️⃣', 0],
    ['2️⃣', 0],
    ['3️⃣', 0],
  ]);
  private userVotes = new Map<string, string>([]);

  getEmojiTrackerResource() {
    return rxResource({
      params: undefined,
      stream: () =>
        of({ comments: [] as Comment[] | null, page: 1 }).pipe(
          expand(({ page, comments }) => {
            if (comments === null) {
              return EMPTY;
            }
            return this.httpClient
              .get<Comment[]>(`https://api.github.com/repos/angular/angular/discussions/61733/comments?page=${page}&per_page=100`)
              .pipe(
                map(response => ({
                  comments: response.length === 0 ? null : response,
                  page: page + 1,
                })),
                catchError(error => {
                  console.error('Error fetching emoji counts:', error);
                  return throwError(() => new Error('Failed to fetch emoji counts. Please try again later.'));
                })
              );
          }),
          map(({ comments }) => comments),
          filter(Boolean),
          map(comments => {
            comments.forEach(comment => {
              const {
                user: { login: username },
                body,
              } = comment;

              if (!this.userVotes.has(username)) {
                const emoji = ['1️⃣', '2️⃣', '3️⃣'].find(emoji => body.includes(emoji));
                if (emoji) {
                  this.userVotes.set(username, emoji);
                  this.counts.set(emoji, (this.counts.get(emoji) || 0) + 1);
                }
              }
            });
            return this.counts;
          }),
          takeLast(1),
          map(counts => {
            const emojiToImage = {
              '1️⃣': './1.webp',
              '2️⃣': './2.webp',
              '3️⃣': './3.webp',
            };
            const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0);
            const maxCount = Math.max(...Array.from(counts.values()));
            return Array.from(counts.entries()).map(([emoji, count]) => ({
              emoji,
              count,
              image: emojiToImage[emoji as keyof typeof emojiToImage],
              percentage: total > 0 ? Math.round((count / total) * 100) : 0,
              isWinner: count === maxCount && count > 0,
            }));
          })
        ),
      defaultValue: [],
    });
  }
}
