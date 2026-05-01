import { createReducer, on } from '@ngrx/store';
import { FundsState } from '../../core/models/fund.model';
import { FundsActions } from './funds.actions';

const initialState: FundsState = {
  searchResults:  [],
  selectedFund:   null,
  fundSummary:    null,
  searchQuery:    '',
  loading:        false,
  detailLoading:  false,
  error:          null,
};

export const fundsReducer = createReducer(
  initialState,

  on(FundsActions.searchFunds, (state, { query }) => ({
    ...state, loading: true, error: null, searchQuery: query,
  })),
  on(FundsActions.searchFundsSuccess, (state, { results }) => ({
    ...state, loading: false, searchResults: results,
  })),
  on(FundsActions.searchFundsFailure, (state, { error }) => ({
    ...state, loading: false, error,
  })),
  on(FundsActions.clearSearch, state => ({
    ...state, searchResults: [], searchQuery: '',
  })),

  on(FundsActions.loadFundDetail, state => ({
    ...state, detailLoading: true, error: null,
  })),
  on(FundsActions.loadFundDetailSuccess, (state, { detail }) => ({
    ...state, detailLoading: false, selectedFund: detail,
  })),
  on(FundsActions.loadFundDetailFailure, (state, { error }) => ({
    ...state, detailLoading: false, error,
  })),
  on(FundsActions.clearFundDetail, state => ({
    ...state, selectedFund: null, fundSummary: null,
  })),
);
