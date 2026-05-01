import { describe, it, expect } from 'vitest';
import { MfApiService } from './mf-api.service';
import { FundDetail } from '../models/fund.model';

// Instantiate without HTTP (only testing pure helper methods)
const svc = new MfApiService(null as any);

const mockDetail: FundDetail = {
  meta: {
    fund_house: 'SBI Mutual Fund',
    scheme_type: 'Open Ended Schemes',
    scheme_category: 'Equity Scheme - Large Cap Fund',
    scheme_code: 119551,
    scheme_name: 'SBI Blue Chip Fund - Regular Plan',
  },
  data: [
    { date: '12-06-2025', nav: '75.1234' },
    { date: '11-06-2025', nav: '74.8000' },
    { date: '10-06-2025', nav: '74.5000' },
  ],
  status: 'SUCCESS',
};

describe('MfApiService — toSummary()', () => {
  it('maps meta fields correctly', () => {
    const s = svc.toSummary(mockDetail);
    expect(s.schemeCode).toBe(119551);
    expect(s.schemeName).toBe('SBI Blue Chip Fund - Regular Plan');
    expect(s.fundHouse).toBe('SBI Mutual Fund');
    expect(s.category).toBe('Equity Scheme - Large Cap Fund');
  });

  it('parses NAV floats from strings', () => {
    const s = svc.toSummary(mockDetail);
    expect(s.currentNav).toBe(75.1234);
    expect(s.previousNav).toBe(74.8);
  });

  it('computes 1-day change correctly', () => {
    const s = svc.toSummary(mockDetail);
    expect(s.change).toBeCloseTo(0.3234, 3);
  });

  it('computes change percent correctly', () => {
    const s = svc.toSummary(mockDetail);
    const expected = ((75.1234 - 74.8) / 74.8) * 100;
    expect(s.changePercent).toBeCloseTo(expected, 1);
  });

  it('picks the latest date', () => {
    const s = svc.toSummary(mockDetail);
    expect(s.date).toBe('12-06-2025');
  });
});

describe('MfApiService — getNavHistory()', () => {
  it('returns correct number of data points', () => {
    const h = svc.getNavHistory(mockDetail, 2);
    expect(h.labels.length).toBe(2);
    expect(h.values.length).toBe(2);
  });

  it('reverses data so oldest is first (chronological order)', () => {
    const h = svc.getNavHistory(mockDetail, 3);
    // API returns newest first; getNavHistory should reverse for chart
    expect(h.labels[0]).toBe('10-06-2025');
    expect(h.labels[2]).toBe('12-06-2025');
  });

  it('parses NAV values as numbers', () => {
    const h = svc.getNavHistory(mockDetail, 1);
    expect(typeof h.values[0]).toBe('number');
    expect(h.values[0]).toBe(75.1234);
  });
});
