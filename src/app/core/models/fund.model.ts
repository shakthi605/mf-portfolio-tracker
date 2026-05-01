// API response types from mfapi.in

export interface MutualFund {
  schemeCode: number;
  schemeName: string;
}

export interface NavData {
  date: string;
  nav: string;
}

export interface FundDetail {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: NavData[];
  status: string;
}

// App-level models

export interface FundSummary {
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
  category: string;
  currentNav: number;
  previousNav: number;
  change: number;
  changePercent: number;
  date: string;
}

export interface WatchlistEntry {
  schemeCode: number;
  schemeName: string;
  addedAt: string;
}

export interface AppState {
  funds: FundsState;
  watchlist: WatchlistState;
}

export interface FundsState {
  searchResults: MutualFund[];
  selectedFund: FundDetail | null;
  fundSummary: FundSummary | null;
  searchQuery: string;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
}

export interface WatchlistState {
  entries: WatchlistEntry[];
}
