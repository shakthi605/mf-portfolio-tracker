import {
  Component, output, input, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        class="search-input"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="onInput($event)"
        (keydown.escape)="clear()"
      />
      @if (value()) {
        <button class="clear-btn" (click)="clear()" aria-label="Clear search">✕</button>
      }
    </div>
  `,
  styles: [`
    .search-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      font-size: 14px;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 11px 40px 11px 42px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      background: #fff;
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;

      &::placeholder { color: var(--text-muted); }
      &:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
      }
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 13px;
      padding: 2px 4px;
      border-radius: 4px;
      &:hover { color: var(--text-primary); }
    }
  `],
})
export class SearchBarComponent {
  readonly placeholder = input('Search mutual funds…');

  readonly searched = output<string>();
  readonly cleared  = output<void>();

  // Angular 21 signal-backed local state
  readonly value = signal('');

  onInput(e: Event): void {
    const q = (e.target as HTMLInputElement).value;
    this.value.set(q);
    this.searched.emit(q);
  }

  clear(): void {
    this.value.set('');
    this.cleared.emit();
  }
}
