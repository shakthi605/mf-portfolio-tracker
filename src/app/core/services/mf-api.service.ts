import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MutualFund, FundDetail, FundSummary } from '../models/fund.model';

@Injectable({ providedIn: 'root' })
export class MfApiService {
  // private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.mfapi.in/mf';
  constructor(private http : HttpClient) { }
  /** Search funds by name keyword */
  searchFunds(query: string): Observable<MutualFund[]> {
    return this.http.get<MutualFund[]>(
      `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
    );
  }

  /** Get full NAV history for a scheme */
  getFundDetail(schemeCode: number): Observable<FundDetail> {
    return this.http.get<FundDetail>(`${this.baseUrl}/${schemeCode}`);
  }

  /** Get latest NAV only (faster endpoint) */
  getLatestNav(schemeCode: number): Observable<FundDetail> {
    return this.http.get<FundDetail>(`${this.baseUrl}/${schemeCode}/latest`);
  }

  /** Map raw FundDetail into a FundSummary with computed change % */
  toSummary(detail: FundDetail): FundSummary {
    const [latest, previous] = detail.data;
    const currentNav = parseFloat(latest?.nav ?? '0');
    const previousNav = parseFloat(previous?.nav ?? '0');
    const change = +(currentNav - previousNav).toFixed(4);
    const changePercent = previousNav
      ? +((change / previousNav) * 100).toFixed(2)
      : 0;

    return {
      schemeCode: detail.meta.scheme_code,
      schemeName: detail.meta.scheme_name,
      fundHouse: detail.meta.fund_house,
      category: detail.meta.scheme_category,
      currentNav,
      previousNav,
      change,
      changePercent,
      date: latest?.date ?? '',
    };
  }

  /** Extract last N days of NAV data for charting */
  getNavHistory(detail: FundDetail, days = 30): { labels: string[]; values: number[] } {
    const slice = [...detail.data].reverse().slice(0, days);
    return {
      labels: slice.map(d => d.date),
      values: slice.map(d => parseFloat(d.nav)),
    };
  }
}
