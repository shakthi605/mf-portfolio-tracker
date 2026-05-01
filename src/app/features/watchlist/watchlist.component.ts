import {
  Component, inject, signal, ChangeDetectionStrategy, OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { WatchlistService } from '../../core/services/watchlist.service';
import { MfApiService } from '../../core/services/mf-api.service';
import { FundSummary } from '../../core/models/fund.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <h1>Watchlist</h1>
      <p>{{ watchlist.count() }} fund{{ watchlist.count() === 1 ? '' : 's' }} tracked</p>
    </div>

    @if (watchlist.entries().length === 0) {
      <div class="empty-state">
        <p class="empty-icon">&#9734;</p>
        <p class="empty-title">Your watchlist is empty</p>
        <p class="text-muted">Search for funds on the dashboard and tap the star to add them here.</p>
        <button class="go-btn" (click)="router.navigate(['/dashboard'])">Go to Dashboard</button>
      </div>
    } @else {
      <div class="watchlist-grid">
        @for (entry of watchlist.entries(); track entry.schemeCode) {
          @let summary = summaryMap()[entry.schemeCode];

          <div class="fund-row card" (click)="goToFund(entry.schemeCode)">
            <div class="row-main">
              <div class="fund-copy">
                <p class="fund-name">{{ entry.schemeName }}</p>
                <p class="meta text-muted">Added {{ formatDate(entry.addedAt) }}</p>
              </div>

              @if (summary) {
                @let isPos = summary.changePercent >= 0;
                <div class="nav-block">
                  <p class="nav-val">&#8377;{{ summary.currentNav.toFixed(2) }}</p>
                  <span class="chip" [class.chip-success]="isPos" [class.chip-danger]="!isPos">
                    {{ isPos ? '▲' : '▼' }} {{ summary.changePercent }}%
                  </span>
                </div>
              } @else {
                <div class="skeleton nav-skeleton"></div>
              }
            </div>

            <button
              class="remove-btn"
              (click)="remove(entry.schemeCode); $event.stopPropagation()"
              aria-label="Remove from watchlist"
            >Remove</button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .watchlist-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .fund-row {
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .fund-row:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow-md);
    }

    .row-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .fund-copy {
      min-width: 0;
      flex: 1;
    }

    .fund-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      line-height: 1.4;
      word-break: break-word;
    }

    .meta {
      font-size: 11px;
      margin-top: 3px;
    }

    .nav-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      flex-shrink: 0;
    }

    .nav-val {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
    }

    .nav-skeleton {
      height: 40px;
      width: 90px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .remove-btn {
      background: none;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 5px 12px;
      font-size: 12px;
      color: var(--text-secondary);
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }

    .remove-btn:hover {
      border-color: var(--danger);
      color: var(--danger);
      background: var(--danger-light);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon  { font-size: 48px; margin-bottom: 16px; }
    .empty-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }

    .go-btn {
      margin-top: 20px;
      padding: 10px 24px;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
    }

    .go-btn:hover { opacity: 0.9; }

    @media (max-width: 640px) {
      .card {
        padding: 16px;
      }

      .row-main {
        flex-direction: column;
        align-items: flex-start;
      }

      .nav-block {
        width: 100%;
        align-items: flex-start;
      }

      .remove-btn {
        width: 100%;
        padding: 10px 12px;
      }
    }
  `],
})
export class WatchlistComponent implements OnInit {
  readonly watchlist = inject(WatchlistService);
  readonly router = inject(Router);
  private readonly mfApi = inject(MfApiService);

  // signal map of schemeCode to FundSummary (loaded on init)
  readonly summaryMap = signal<Record<number, FundSummary>>({});

  ngOnInit(): void {
    this.watchlist.entries().forEach(entry => {
      this.mfApi.getFundDetail(entry.schemeCode).subscribe(detail => {
        const summary = this.mfApi.toSummary(detail);
        this.summaryMap.update(m => ({ ...m, [entry.schemeCode]: summary }));
      });
    });
  }

  remove(schemeCode: number): void {
    this.watchlist.remove(schemeCode);
  }

  goToFund(code: number): void {
    this.router.navigate(['/fund', code]);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
}
