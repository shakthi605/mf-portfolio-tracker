import { createReducer, on } from '@ngrx/store';
import { createActionGroup, props } from '@ngrx/store';
import { WatchlistEntry, WatchlistState } from '../../core/models/fund.model';

// Actions inline for brevity — watchlist is simple enough
export const WatchlistActions = createActionGroup({
  source: 'Watchlist',
  events: {
    'Add Entry':    props<{ entry: WatchlistEntry }>(),
    'Remove Entry': props<{ schemeCode: number }>(),
  },
});

const STORAGE_KEY = 'mf_watchlist_ngrx';

function load(): WatchlistEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}

const initialState: WatchlistState = { entries: load() };

export const watchlistReducer = createReducer(
  initialState,
  on(WatchlistActions.addEntry, (state, { entry }) => {
    if (state.entries.some(e => e.schemeCode === entry.schemeCode)) return state;
    const entries = [...state.entries, entry];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return { entries };
  }),
  on(WatchlistActions.removeEntry, (state, { schemeCode }) => {
    const entries = state.entries.filter(e => e.schemeCode !== schemeCode);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return { entries };
  }),
);
