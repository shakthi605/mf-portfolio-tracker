import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { WatchlistService } from './core/services/watchlist.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="mobile-header">
        <div class="brand">
          <span class="brand-icon">&#128200;</span>
          <span class="brand-name">MF Tracker</span>
        </div>
      </header>

      <nav class="sidebar">
        <div class="brand">
          <span class="brand-icon">&#128200;</span>
          <span class="brand-name">MF Tracker</span>
        </div>

        <ul class="nav-links">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active">
              <span class="icon">&#8962;</span> Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/watchlist" routerLinkActive="active">
              <span class="icon">&#9733;</span> Watchlist
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

      <nav class="mobile-nav" aria-label="Primary">
        <a routerLink="/dashboard" routerLinkActive="active">
          <span class="icon">&#8962;</span>
          <span>Dashboard</span>
        </a>
        <a routerLink="/watchlist" routerLinkActive="active">
          <span class="icon">&#9733;</span>
          <span>Watchlist</span>
          @if (watchlist.count() > 0) {
            <span class="badge">{{ watchlist.count() }}</span>
          }
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
    }

    .mobile-header,
    .mobile-nav {
      display: none;
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
    }

    .brand-icon { font-size: 22px; }
    .brand-name { font-weight: 600; font-size: 16px; color: var(--text-primary); }

    .nav-links {
      list-style: none;
      padding: 16px 12px;
      flex: 1;
    }

    .nav-links li { margin-bottom: 4px; }

    .nav-links a {
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
    }

    .nav-links a:hover { background: var(--bg); color: var(--text-primary); }
    .nav-links a.active { background: var(--primary-light); color: var(--primary); }
    .nav-links .icon { font-size: 16px; width: 20px; text-align: center; }

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
      .app-shell {
        display: block;
        overflow: visible;
      }

      .mobile-header {
        display: flex;
        align-items: center;
        padding: 16px;
        background: #fff;
        border-bottom: 1px solid var(--border);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .mobile-header .brand {
        width: 100%;
        padding: 0;
        border-bottom: 0;
      }

      .sidebar { display: none; }

      .main-content { padding: 20px 16px 88px; }

      .mobile-nav {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
        background: rgba(255, 255, 255, 0.96);
        border-top: 1px solid var(--border);
        backdrop-filter: blur(10px);
        z-index: 20;
      }

      .mobile-nav a {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 10px 12px;
        border-radius: var(--radius);
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 12px;
        font-weight: 600;
      }

      .mobile-nav a.active {
        background: var(--primary-light);
        color: var(--primary);
      }

      .mobile-nav .icon {
        font-size: 18px;
        line-height: 1;
      }

      .mobile-nav .badge {
        position: absolute;
        top: 6px;
        right: 18%;
        margin-left: 0;
      }
    }
  `],
})
export class AppComponent {
  readonly watchlist = inject(WatchlistService);
}
