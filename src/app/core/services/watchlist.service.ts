import { Injectable, signal, computed } from '@angular/core';
import { WatchlistEntry } from '../models/fund.model';

const STORAGE_KEY = 'mf_watchlist';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  // Angular 21 Signals for reactive state
  private readonly _entries = signal<WatchlistEntry[]>(this.load());

  readonly entries  = this._entries.asReadonly();
  readonly count    = computed(() => this._entries().length);
  readonly codes    = computed(() => new Set(this._entries().map(e => e.schemeCode)));

  isWatched(schemeCode: number) {
    return computed(() => this.codes().has(schemeCode));
  }

  add(entry: Omit<WatchlistEntry, 'addedAt'>): void {
    if (this.codes().has(entry.schemeCode)) return;
    const updated = [...this._entries(), { ...entry, addedAt: new Date().toISOString() }];
    this._entries.set(updated);
    this.persist(updated);
  }

  remove(schemeCode: number): void {
    const updated = this._entries().filter(e => e.schemeCode !== schemeCode);
    this._entries.set(updated);
    this.persist(updated);
  }

  toggle(entry: Omit<WatchlistEntry, 'addedAt'>): void {
    this.codes().has(entry.schemeCode) ? this.remove(entry.schemeCode) : this.add(entry);
  }

  private load(): WatchlistEntry[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private persist(entries: WatchlistEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}
