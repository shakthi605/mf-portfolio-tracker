import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard — MF Portfolio Tracker',
  },
  {
    path: 'fund/:code',
    loadComponent: () =>
      import('./features/fund-detail/fund-detail.component').then(m => m.FundDetailComponent),
    title: 'Fund Detail — MF Portfolio Tracker',
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./features/watchlist/watchlist.component').then(m => m.WatchlistComponent),
    title: 'Watchlist — MF Portfolio Tracker',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
