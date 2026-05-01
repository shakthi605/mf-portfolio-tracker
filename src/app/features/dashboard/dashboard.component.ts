import {
  Component, inject, signal, computed, OnInit, ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MutualFund } from '../../core/models/fund.model';
import { WatchlistService } from '../../core/services/watchlist.service';
import { MfApiService } from '../../core/services/mf-api.service';
import { FundsActions } from '../../store/funds/funds.actions';
import {
  selectSearchResults, selectLoading, selectSearchQuery,
} from '../../store/funds/funds.selectors';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { toSignal } from '@angular/core/rxjs-interop';

// Popular fund codes to display by default
const FEATURED_CODES = [119551, 120503, 125354, 120465];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchBarComponent],
  template: `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Search and explore mutual fund NAV data in real time.</p>
    </div>

    <!-- Search -->
    <app-search-bar
      placeholder="Search by fund name, AMC…"
      (searched)="onSearch($event)"
      (cleared)="onClear()"
    />

    <!-- Search results -->
    @if (searchQuery()) {
      <div class="results-section">
        <p class="section-title">
          Results for "<strong>{{ searchQuery() }}</strong>"
          @if (loading()) { <span class="text-muted"> — searching…</span> }
        </p>

        @defer (when !loading()) {
          <div class="results-list">
            @for (fund of searchResults(); track fund.schemeCode) {
              <div class="result-row" (click)="goToFund(fund)">
                <div>
                  <p class="fund-name">{{ fund.schemeName }}</p>
                </div>
                <button
                  class="watch-mini"
                  [class.on]="watchlist.codes().has(fund.schemeCode)"
                  (click)="toggleWatch(fund); $event.stopPropagation()"
                >
                  {{ watchlist.codes().has(fund.schemeCode) ? '★' : '☆' }}
                </button>
              </div>
            } @empty {
              <p class="text-muted" style="padding:20px 0;">No funds found — try a different keyword.</p>
            }
          </div>
        } @placeholder {
          <div class="skeleton-list">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="skeleton" style="height:48px; margin-bottom:8px;"></div>
            }
          </div>
        }
      </div>
    } @else {
      <!-- Popular funds -->
      <div class="section-title" style="margin-top:28px;">Popular funds</div>
      <div class="featured-grid">
        @for (s of featuredSummaries(); track s.schemeCode) {
          @let isPos = s.changePercent >= 0;
          <div class="featured-card" (click)="goToCode(s.schemeCode)">
            <p class="fund-name">{{ s.schemeName }}</p>
            <p class="text-muted" style="font-size:11px; margin:3px 0 12px;">{{ s.fundHouse }}</p>
            <div class="nav-row">
              <span class="nav-val">₹{{ s.currentNav.toFixed(2) }}</span>
              <span class="change-pill" [class.pos]="isPos" [class.neg]="!isPos">
                {{ isPos ? '▲' : '▼' }} {{ s.changePercent }}%
              </span>
            </div>
          </div>
        } @empty {
          @for (i of [1,2,3,4]; track i) {
            <div class="skeleton" style="height:110px;"></div>
          }
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .results-section { margin-top: 20px; }

    .section-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 14px;
    }

    .results-list {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: #fff;
    }

    .result-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 13px 18px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background 0.1s;

      &:last-child { border-bottom: none; }
      &:hover { background: var(--bg); }
    }

    .fund-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .watch-mini {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: var(--text-muted);
      padding: 4px 6px;
      flex-shrink: 0;
      &:hover, &.on { color: var(--warning); }
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
    }

    .featured-card {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
      cursor: pointer;
      transition: box-shadow 0.15s, border-color 0.15s;

      &:hover { border-color: var(--primary); box-shadow: var(--shadow-md); }
    }

    .nav-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-val { font-size: 18px; font-weight: 600; }

    .change-pill {
      font-size: 12px;
      font-weight: 500;
      padding: 3px 9px;
      border-radius: 99px;
      &.pos { background: var(--success-light); color: var(--success); }
      &.neg { background: var(--danger-light);  color: var(--danger);  }
    }

    .skeleton-list { margin-top: 4px; }
  `],
})
export class DashboardComponent implements OnInit {
  private readonly store    = inject(Store);
  private readonly mfApi    = inject(MfApiService);
  private readonly router   = inject(Router);
  readonly watchlist        = inject(WatchlistService);

  readonly searchResults = toSignal(this.store.select(selectSearchResults), { initialValue: [] });
  readonly loading       = toSignal(this.store.select(selectLoading),       { initialValue: false });
  readonly searchQuery   = toSignal(this.store.select(selectSearchQuery),   { initialValue: '' });

  readonly featuredSummaries = signal<ReturnType<MfApiService['toSummary']>[]>([]);

  ngOnInit(): void {
    this.loadFeatured();
  }

  private loadFeatured(): void {
    FEATURED_CODES.forEach(code => {
      this.mfApi.getFundDetail(code).subscribe(detail => {
        const summary = this.mfApi.toSummary(detail);
        this.featuredSummaries.update(prev => [...prev, summary]);
      });
    });
  }

  onSearch(q: string): void {
    if (q.trim().length < 2) return;
    this.store.dispatch(FundsActions.searchFunds({ query: q }));
  }

  onClear(): void {
    this.store.dispatch(FundsActions.clearSearch());
  }

  goToFund(fund: MutualFund): void {
    this.router.navigate(['/fund', fund.schemeCode]);
  }

  goToCode(code: number): void {
    this.router.navigate(['/fund', code]);
  }

  toggleWatch(fund: MutualFund): void {
    this.watchlist.toggle({ schemeCode: fund.schemeCode, schemeName: fund.schemeName });
  }
}
