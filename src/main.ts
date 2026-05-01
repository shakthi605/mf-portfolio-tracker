import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { fundsReducer } from './app/store/funds/funds.reducer';
import { watchlistReducer } from './app/store/watchlist/watchlist.reducer';
import { FundsEffects } from './app/store/funds/funds.effects';

bootstrapApplication(AppComponent, {
  providers: [
    // Angular 21: zoneless change detection (stable)
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideStore({
      funds: fundsReducer,
      watchlist: watchlistReducer,
    }),
    provideEffects([FundsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
}).catch(console.error);
