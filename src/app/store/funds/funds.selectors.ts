import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FundsState } from '../../core/models/fund.model';
import { MfApiService } from '../../core/services/mf-api.service';

const selectFundsState = createFeatureSelector<FundsState>('funds');

export const selectSearchResults  = createSelector(selectFundsState, s => s.searchResults);
export const selectSelectedFund   = createSelector(selectFundsState, s => s.selectedFund);
export const selectSearchQuery    = createSelector(selectFundsState, s => s.searchQuery);
export const selectLoading        = createSelector(selectFundsState, s => s.loading);
export const selectDetailLoading  = createSelector(selectFundsState, s => s.detailLoading);
export const selectError          = createSelector(selectFundsState, s => s.error);

// Derived — compute fund summary on the fly from raw detail
export const selectFundSummary = createSelector(
  selectSelectedFund,
  (detail) => {
    if (!detail) return null;
    const svc = new MfApiService(null as any);  // stateless helper — no HTTP needed
    return svc.toSummary(detail);
  }
);

export const selectNavHistory = (days: number) => createSelector(
  selectSelectedFund,
  (detail) => {
    if (!detail) return null;
    const svc = new MfApiService(null as any);
    return svc.getNavHistory(detail, days);
  }
);
