import { describe, it, expect } from 'vitest';
import { fundsReducer } from './funds.reducer';
import { FundsActions } from './funds.actions';
import { FundsState } from '../../core/models/fund.model';

const initial: FundsState = {
  searchResults:  [],
  selectedFund:   null,
  fundSummary:    null,
  searchQuery:    '',
  loading:        false,
  detailLoading:  false,
  error:          null,
};

describe('fundsReducer', () => {
  it('returns the initial state for unknown action', () => {
    const state = fundsReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(initial);
  });

  it('sets loading=true and records query on searchFunds', () => {
    const state = fundsReducer(initial, FundsActions.searchFunds({ query: 'SBI' }));
    expect(state.loading).toBe(true);
    expect(state.searchQuery).toBe('SBI');
    expect(state.error).toBeNull();
  });

  it('stores results and clears loading on success', () => {
    const loading = { ...initial, loading: true };
    const results = [{ schemeCode: 1, schemeName: 'SBI Fund' }];
    const state   = fundsReducer(loading, FundsActions.searchFundsSuccess({ results }));
    expect(state.loading).toBe(false);
    expect(state.searchResults).toEqual(results);
  });

  it('stores error and clears loading on failure', () => {
    const loading = { ...initial, loading: true };
    const state   = fundsReducer(loading, FundsActions.searchFundsFailure({ error: 'Network error' }));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('clears search results and query on clearSearch', () => {
    const withData = { ...initial, searchResults: [{ schemeCode: 1, schemeName: 'X' }], searchQuery: 'X' };
    const state    = fundsReducer(withData, FundsActions.clearSearch());
    expect(state.searchResults).toEqual([]);
    expect(state.searchQuery).toBe('');
  });

  it('sets detailLoading=true on loadFundDetail', () => {
    const state = fundsReducer(initial, FundsActions.loadFundDetail({ schemeCode: 119551 }));
    expect(state.detailLoading).toBe(true);
  });

  it('stores detail and clears loading on success', () => {
    const loading = { ...initial, detailLoading: true };
    const detail  = { meta: { scheme_code: 1, scheme_name: 'X', fund_house: 'Y', scheme_type: '', scheme_category: '' }, data: [], status: 'SUCCESS' };
    const state   = fundsReducer(loading, FundsActions.loadFundDetailSuccess({ detail }));
    expect(state.detailLoading).toBe(false);
    expect(state.selectedFund).toEqual(detail);
  });

  it('clears fund detail on clearFundDetail', () => {
    const withFund = { ...initial, selectedFund: { meta: {} as any, data: [], status: '' } };
    const state    = fundsReducer(withFund, FundsActions.clearFundDetail());
    expect(state.selectedFund).toBeNull();
    expect(state.fundSummary).toBeNull();
  });
});
