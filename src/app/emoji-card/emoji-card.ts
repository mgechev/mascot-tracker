import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {EmojiCount} from '../models/emoji-count.model';

type PodiumPosition = 'first' | 'second' | 'third';

@Component({
  selector: 'app-emoji-card',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" [class]="podiumClass()">
      <img [ngSrc]="emojiData().image" [alt]="emojiData().emoji" class="emoji-image" [height]="size()" [width]="size()">
      <div class="count-badge">{{ emojiData().count }}</div>
      <div class="progress-bar">
        <div class="progress" [style.width.%]="percentage()"></div>
      </div>
      <div class="percentage">{{ percentage() }}%</div>
    </div>
  `,
  styles: [`
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
      object-fit: contain;
      margin-bottom: 15px;
      transition: transform 0.3s ease;
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

    /* Podium specific styles */
    .podium-first {
      box-shadow: 0 15px 20px rgba(255, 221, 90, 0.25);
      border: 2px solid #ffdd59;
    }

    .podium-second {
      box-shadow: 0 10px 20px rgba(200, 214, 229, 0.15);
      border: 2px solid #c8d6e5;
    }

    .podium-third {
      box-shadow: 0 10px 20px rgba(205, 127, 50, 0.15);
      border: 2px solid #cd7f32;
    }
  `]
})
export class EmojiCard {
  emojiData = input.required<EmojiCount>();
  percentage = input.required<number>();
  size = input<number>(200);
  podiumPosition = input<PodiumPosition | null>(null);

  podiumClass = computed(() => {
    const position = this.podiumPosition();
    return position ? `podium-${position}` : '';
  });
}
