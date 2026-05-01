import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, of, switchMap } from 'rxjs';
import { MfApiService } from '../../core/services/mf-api.service';
import { FundsActions } from './funds.actions';

@Injectable()
export class FundsEffects {
  private readonly actions$ = inject(Actions);
  private readonly mfApi    = inject(MfApiService);

  searchFunds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FundsActions.searchFunds),
      debounceTime(350),
      switchMap(({ query }) =>
        this.mfApi.searchFunds(query).pipe(
          map(results => FundsActions.searchFundsSuccess({ results })),
          catchError(err  => of(FundsActions.searchFundsFailure({ error: err.message })))
        )
      )
    )
  );

  loadFundDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FundsActions.loadFundDetail),
      switchMap(({ schemeCode }) =>
        this.mfApi.getFundDetail(schemeCode).pipe(
          map(detail => FundsActions.loadFundDetailSuccess({ detail })),
          catchError(err => of(FundsActions.loadFundDetailFailure({ error: err.message })))
        )
      )
    )
  );
}
