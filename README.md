# 📈 MF Portfolio Tracker

> A real-time Mutual Fund NAV tracker built with **Angular 21** — featuring Signals, zoneless change detection, NgRx state management, Chart.js analytics, and a live watchlist.

[![CI](https://github.com/YOUR_USERNAME/mf-portfolio-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/mf-portfolio-tracker/actions)
[![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.dev)
[![NgRx](https://img.shields.io/badge/NgRx-21-purple?logo=redux)](https://ngrx.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌐 Live Demo
**[View Live →](https://YOUR_USERNAME.github.io/mf-portfolio-tracker/)**

---

## ✨ Features

| Feature | Detail |
|---------|--------|
| 🔍 **Live Fund Search** | Instant search across 15,000+ Indian mutual funds via [mfapi.in](https://mfapi.in) |
| 📊 **NAV Charts** | Interactive Chart.js line charts with 1W / 1M / 3M / 6M / 1Y period selector |
| ⭐ **Watchlist** | Add/remove funds — persisted in localStorage, reactive via Angular Signals |
| 🏎️ **Zoneless CD** | Angular 21 `provideExperimentalZonelessChangeDetection` — no Zone.js overhead |
| 🗃️ **NgRx Store** | Full Redux flow: actions → effects → reducers → selectors for all async state |
| ⚡ **@defer blocks** | Native Angular 21 deferred loading — chart renders only when data is ready |
| 🧪 **Unit Tests** | Vitest test suite — service pure functions and all reducer branches covered |
| 🚀 **Auto Deploy** | GitHub Actions CI builds + tests + deploys to GitHub Pages on every push to `main` |

---

## 🏗️ Architecture

```
src/app/
├── core/
│   ├── models/         # TypeScript interfaces (FundDetail, FundSummary, WatchlistEntry)
│   └── services/       # MfApiService (HTTP), WatchlistService (Signal-driven)
├── store/
│   ├── funds/          # NgRx actions, reducer, effects, selectors
│   └── watchlist/      # NgRx watchlist reducer
├── features/           # Lazy-loaded route components
│   ├── dashboard/      # Search + featured fund cards
│   ├── fund-detail/    # NAV chart + stats + period selector
│   └── watchlist/      # Saved funds with live NAV
└── shared/
    └── components/
        ├── search-bar/ # Reusable signal-backed search input
        ├── nav-card/   # Fund summary card with change indicators
        └── chart/      # Chart.js wrapper component
```

### Angular 21 patterns used

- **Standalone components** — no NgModules anywhere
- **Signals** (`signal()`, `computed()`, `effect()`) for local and service-level state
- **`toSignal()`** — bridges NgRx Observable selectors into the signal world
- **`@defer`** blocks — native deferred rendering for the chart section
- **`@let`** — new Angular 21 template variable syntax
- **`input()` / `output()`** — new functional input/output API
- **Zoneless** — `provideExperimentalZonelessChangeDetection()`
- **`withComponentInputBinding()`** — route params auto-bound as component inputs

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Angular CLI 21: `npm install -g @angular/cli@21`

### Install & run

```bash
git clone https://github.com/YOUR_USERNAME/mf-portfolio-tracker.git
cd mf-portfolio-tracker
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

### Run tests

```bash
npm test          # run once
npm run test:watch  # watch mode
```

### Production build

```bash
npm run build:prod
```

---

## 📡 Data Source

All NAV data is fetched from **[mfapi.in](https://mfapi.in)** — a free, open, no-auth REST API for Indian mutual fund data provided by AMFI.

```
GET https://api.mfapi.in/mf/search?q=SBI         # search funds
GET https://api.mfapi.in/mf/{schemeCode}          # full NAV history
GET https://api.mfapi.in/mf/{schemeCode}/latest   # latest NAV only
```

---

## 🧪 Test Coverage

```
src/app/core/services/mf-api.service.spec.ts     — toSummary(), getNavHistory()
src/app/store/funds/funds.reducer.spec.ts         — all reducer branches
```

Run `npm test -- --coverage` for a full report.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21 (standalone + zoneless) |
| State | NgRx 21 (store, effects, store-devtools) |
| Reactivity | Angular Signals + RxJS 7 |
| Charts | Chart.js 4 |
| Styling | SCSS with CSS custom properties |
| Testing | Vitest 2 |
| CI/CD | GitHub Actions → GitHub Pages |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push and open a pull request

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

*Built by [Sivasakthi Sundaresan](https://github.com/YOUR_USERNAME) · Senior Angular Developer*
