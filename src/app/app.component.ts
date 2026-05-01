import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { WatchlistService } from './core/services/watchlist.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <nav class="sidebar">
        <div class="brand">
          <span class="brand-icon">📈</span>
          <span class="brand-name">MF Tracker</span>
        </div>

        <ul class="nav-links">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active">
              <span class="icon">⊞</span> Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/watchlist" routerLinkActive="active">
              <span class="icon">★</span> Watchlist
              @if (watchlist.count() > 0) {
                <span class="badge">{{ watchlist.count() }}</span>
              }
            </a>
          </li>
        </ul>

        <div class="sidebar-footer">
          <p class="text-muted" style="font-size:11px;">
            Data: <a href="https://mfapi.in" target="_blank" style="color:var(--primary)">mfapi.in</a>
          </p>
        </div>
      </nav>

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 220px;
      min-width: 220px;
      background: #fff;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 20px 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 20px 24px;
      border-bottom: 1px solid var(--border);
      .brand-icon { font-size: 22px; }
      .brand-name { font-weight: 600; font-size: 16px; color: var(--text-primary); }
    }

    .nav-links {
      list-style: none;
      padding: 16px 12px;
      flex: 1;

      li { margin-bottom: 4px; }

      a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: var(--radius);
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: background 0.15s, color 0.15s;

        &:hover { background: var(--bg); color: var(--text-primary); }
        &.active { background: var(--primary-light); color: var(--primary); }

        .icon { font-size: 16px; width: 20px; text-align: center; }
      }
    }

    .badge {
      margin-left: auto;
      background: var(--primary);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 1px 7px;
      border-radius: 99px;
      min-width: 20px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 16px 20px 0;
      border-top: 1px solid var(--border);
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px 36px;
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-content { padding: 20px 16px; }
    }
  `],
})
export class AppComponent {
  readonly watchlist = inject(WatchlistService);
}
