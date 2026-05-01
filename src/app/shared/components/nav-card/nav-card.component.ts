import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FundSummary } from '../../../core/models/fund.model';

@Component({
  selector: 'app-nav-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @let fund = data();
    @let isPositive = fund.changePercent >= 0;

    <div class="nav-card" [routerLink]="['/fund', fund.schemeCode]">
      <div class="card-top">
        <div class="fund-info">
          <p class="fund-name">{{ fund.schemeName }}</p>
          <p class="fund-house text-muted">{{ fund.fundHouse }}</p>
        </div>
        <button
          class="watch-btn"
          [class.watched]="watched()"
          (click)="toggleWatch.emit(); $event.stopPropagation()"
          [attr.aria-label]="watched() ? 'Remove from watchlist' : 'Add to watchlist'"
        >
          {{ watched() ? '★' : '☆' }}
        </button>
      </div>

      <div class="nav-row">
        <div>
          <p class="nav-label text-muted">NAV</p>
          <p class="nav-value">₹{{ fund.currentNav.toFixed(4) }}</p>
        </div>
        <div class="change-block" [class.positive]="isPositive" [class.negative]="!isPositive">
          <span class="change-arrow">{{ isPositive ? '▲' : '▼' }}</span>
          <span class="change-pct">{{ isPositive ? '+' : '' }}{{ fund.changePercent }}%</span>
          <span class="change-abs">({{ isPositive ? '+' : '' }}{{ fund.change.toFixed(4) }})</span>
        </div>
      </div>

      <p class="nav-date text-muted">as of {{ fund.date }}</p>
    </div>
  `,
  styles: [`
    .nav-card {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
      cursor: pointer;
      transition: box-shadow 0.15s, border-color 0.15s;

      &:hover {
        border-color: var(--primary);
        box-shadow: var(--shadow-md);
      }
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 14px;
    }

    .fund-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .fund-house {
      font-size: 11px;
      margin-top: 3px;
    }

    .watch-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: var(--text-muted);
      padding: 0 0 0 8px;
      flex-shrink: 0;
      transition: color 0.15s;

      &:hover { color: var(--warning); }
      &.watched { color: var(--warning); }
    }

    .nav-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 6px;
    }

    .nav-label { font-size: 11px; margin-bottom: 2px; }
    .nav-value  { font-size: 20px; font-weight: 600; color: var(--text-primary); }

    .change-block {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 500;

      &.positive { color: var(--success); }
      &.negative { color: var(--danger); }

      .change-pct { font-size: 14px; font-weight: 600; }
      .change-abs { font-size: 11px; opacity: 0.75; }
    }

    .nav-date { font-size: 11px; }
  `],
})
export class NavCardComponent {
  readonly data        = input.required<FundSummary>();
  readonly watched     = input<boolean>(false);
  readonly toggleWatch = output<void>();
}
