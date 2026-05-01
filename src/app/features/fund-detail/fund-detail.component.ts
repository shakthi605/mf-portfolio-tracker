import {
  Component, inject, signal, computed, OnInit, OnDestroy, ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MfApiService } from '../../core/services/mf-api.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { FundsActions } from '../../store/funds/funds.actions';
import {
  selectSelectedFund, selectDetailLoading, selectFundSummary,
} from '../../store/funds/funds.selectors';
import { NavChartComponent } from '../../shared/components/chart/nav-chart.component';

type Period = '1W' | '1M' | '3M' | '6M' | '1Y';

const PERIOD_DAYS: Record<Period, number> = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };

@Component({
  selector: 'app-fund-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavChartComponent],
  template: `
    @let loading = detailLoading();
    @let fund    = fundSummary();

    <!-- Back -->
    <button class="back-btn" (click)="router.navigate(['/dashboard'])">← Back</button>

    @if (loading) {
      <div class="skeleton-layout">
        <div class="skeleton" style="height:28px; width:60%; margin-bottom:8px;"></div>
        <div class="skeleton" style="height:16px; width:40%; margin-bottom:32px;"></div>
        <div class="skeleton" style="height:260px; margin-bottom:24px;"></div>
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px;">
          @for (i of [1,2,3,4]; track i) {
            <div class="skeleton" style="height:72px;"></div>
          }
        </div>
      </div>
    } @else if (fund) {
      @let isPos = fund.changePercent >= 0;

      <!-- Header -->
      <div class="fund-header">
        <div>
          <h1 class="fund-title">{{ fund.schemeName }}</h1>
          <p class="text-muted" style="font-size:13px; margin-top:4px;">
            {{ fund.fundHouse }} · {{ fund.category }}
          </p>
        </div>
        <button
          class="watch-btn"
          [class.watched]="isWatched()"
          (click)="toggleWatch()"
        >
          {{ isWatched() ? '★ Watching' : '☆ Watch' }}
        </button>
      </div>

      <!-- NAV hero -->
      <div class="nav-hero">
        <span class="nav-big">₹{{ fund.currentNav.toFixed(4) }}</span>
        <span class="change-pill" [class.pos]="isPos" [class.neg]="!isPos">
          {{ isPos ? '▲' : '▼' }} {{ isPos ? '+' : '' }}{{ fund.change.toFixed(4) }}
          ({{ isPos ? '+' : '' }}{{ fund.changePercent }}%)
        </span>
        <span class="text-muted" style="font-size:12px; margin-left:8px;">as of {{ fund.date }}</span>
      </div>

      <!-- Period selector -->
      <div class="period-row">
        @for (p of periods; track p) {
          <button
            class="period-btn"
            [class.active]="selectedPeriod() === p"
            (click)="setPeriod(p)"
          >{{ p }}</button>
        }
      </div>

      <!-- Chart — deferred until data is ready -->
      @defer (when chartData() !== null) {
        <div class="chart-card card">
          <app-nav-chart
            [labels]="chartData()!.labels"
            [values]="chartData()!.values"
            [color]="isPos ? '#16a34a' : '#dc2626'"
          />
        </div>
      } @placeholder {
        <div class="skeleton" style="height:290px; border-radius:var(--radius-lg);"></div>
      }

      <!-- Stats grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">Current NAV</p>
          <p class="stat-value">₹{{ fund.currentNav.toFixed(4) }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Previous NAV</p>
          <p class="stat-value">₹{{ fund.previousNav.toFixed(4) }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">1-Day Change</p>
          <p class="stat-value" [class.text-success]="isPos" [class.text-danger]="!isPos">
            {{ isPos ? '+' : '' }}{{ fund.changePercent }}%
          </p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Scheme Code</p>
          <p class="stat-value">{{ fund.schemeCode }}</p>
        </div>
      </div>

      <!-- @let example — new Angular 21 template syntax -->
      @let periodLabel = selectedPeriod() + ' NAV History';
      <p class="text-muted" style="font-size:12px; margin-top:16px;">
        Showing: {{ periodLabel }} · {{ chartData()?.labels?.length ?? 0 }} data points
      </p>

    } @else {
      <p class="text-muted">Fund not found.</p>
    }
  `,
  styles: [`
    :host { display: block; }

    .back-btn {
      background: none;
      border: none;
      color: var(--primary);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      padding: 0;
      margin-bottom: 20px;
      font-family: inherit;
      &:hover { text-decoration: underline; }
    }

    .fund-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
    }

    .fund-title {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.3;
      color: var(--text-primary);
    }

    .watch-btn {
      padding: 8px 18px;
      border-radius: 8px;
      border: 1.5px solid var(--border);
      background: #fff;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      font-family: inherit;
      color: var(--text-secondary);
      transition: all 0.15s;
      flex-shrink: 0;

      &:hover { border-color: var(--warning); color: var(--warning); }
      &.watched { background: #fffbeb; border-color: var(--warning); color: var(--warning); }
    }

    .nav-hero {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .nav-big { font-size: 32px; font-weight: 700; color: var(--text-primary); }

    .change-pill {
      font-size: 14px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 99px;
      &.pos { background: var(--success-light); color: var(--success); }
      &.neg { background: var(--danger-light);  color: var(--danger);  }
    }

    .period-row {
      display: flex;
      gap: 6px;
      margin-bottom: 16px;
    }

    .period-btn {
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: #fff;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      color: var(--text-secondary);
      transition: all 0.15s;

      &:hover { border-color: var(--primary); color: var(--primary); }
      &.active { background: var(--primary); border-color: var(--primary); color: #fff; }
    }

    .chart-card {
      margin-bottom: 20px;
      padding: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
      margin-top: 20px;
    }

    .stat-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px 16px;
    }

    .stat-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .skeleton-layout { margin-top: 8px; }
  `],
})
export class FundDetailComponent implements OnInit, OnDestroy {
  private readonly store   = inject(Store);
  private readonly route   = inject(ActivatedRoute);
  readonly router          = inject(Router);
  private readonly mfApi   = inject(MfApiService);
  readonly watchlist       = inject(WatchlistService);

  readonly selectedFund   = toSignal(this.store.select(selectSelectedFund),   { initialValue: null });
  readonly detailLoading  = toSignal(this.store.select(selectDetailLoading),  { initialValue: true });
  readonly fundSummary    = toSignal(this.store.select(selectFundSummary),    { initialValue: null });

  readonly periods: Period[] = ['1W', '1M', '3M', '6M', '1Y'];
  readonly selectedPeriod    = signal<Period>('1M');

  readonly chartData = computed(() => {
    const detail = this.selectedFund();
    if (!detail) return null;
    return this.mfApi.getNavHistory(detail, PERIOD_DAYS[this.selectedPeriod()]);
  });

  readonly isWatched = computed(() => {
    const s = this.fundSummary();
    return s ? this.watchlist.codes().has(s.schemeCode) : false;
  });

  ngOnInit(): void {
    const code = Number(this.route.snapshot.paramMap.get('code'));
    this.store.dispatch(FundsActions.loadFundDetail({ schemeCode: code }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(FundsActions.clearFundDetail());
  }

  setPeriod(p: Period): void {
    this.selectedPeriod.set(p);
  }

  toggleWatch(): void {
    const s = this.fundSummary();
    if (!s) return;
    this.watchlist.toggle({ schemeCode: s.schemeCode, schemeName: s.schemeName });
  }
}
