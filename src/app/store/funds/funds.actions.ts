import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { MutualFund, FundDetail } from '../../core/models/fund.model';

export const FundsActions = createActionGroup({
  source: 'Funds',
  events: {
    'Search Funds':         props<{ query: string }>(),
    'Search Funds Success': props<{ results: MutualFund[] }>(),
    'Search Funds Failure': props<{ error: string }>(),
    'Clear Search':         emptyProps(),

    'Load Fund Detail':         props<{ schemeCode: number }>(),
    'Load Fund Detail Success': props<{ detail: FundDetail }>(),
    'Load Fund Detail Failure': props<{ error: string }>(),
    'Clear Fund Detail':        emptyProps(),
  },
});
