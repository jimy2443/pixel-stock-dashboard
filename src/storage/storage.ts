import type { WatchlistItem, AppSettings, SearchHistoryItem } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { STORAGE } from '../utils/constants';

const KEYS = {
  WATCHLIST: `${STORAGE.PREFIX}watchlist`,
  SETTINGS: `${STORAGE.PREFIX}settings`,
  SEARCH_HISTORY: `${STORAGE.PREFIX}search_history`,
  SCHEMA_VERSION: `${STORAGE.PREFIX}schema_version`,
} as const;

function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function safeSet(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const memoryStore = new Map<string, unknown>();

function get<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable()) {
    const mem = memoryStore.get(key);
    return mem !== undefined ? (mem as T) : defaultValue;
  }
  return safeGet(key, defaultValue);
}

function set(key: string, value: unknown): boolean {
  if (!isStorageAvailable()) {
    memoryStore.set(key, value);
    return true;
  }
  return safeSet(key, value);
}

function remove(key: string): void {
  if (!isStorageAvailable()) {
    memoryStore.delete(key);
  } else {
    localStorage.removeItem(key);
  }
}

export function getWatchlist(): WatchlistItem[] {
  return get(KEYS.WATCHLIST, []);
}

export function setWatchlist(items: WatchlistItem[]): boolean {
  return set(KEYS.WATCHLIST, items);
}

export function addToWatchlist(item: WatchlistItem): { success: boolean; reason?: string } {
  const list = getWatchlist();
  if (list.length >= STORAGE.MAX_WATCHLIST) {
    return { success: false, reason: `最多关注 ${STORAGE.MAX_WATCHLIST} 只股票` };
  }
  if (list.some((i) => i.code === item.code)) {
    return { success: false, reason: '该股票已在自选列表中' };
  }
  const newItem = { ...item, sortOrder: Date.now() };
  setWatchlist([newItem, ...list]);
  return { success: true };
}

export function removeFromWatchlist(code: string): void {
  const list = getWatchlist();
  setWatchlist(list.filter((i) => i.code !== code));
}

export function reorderWatchlist(codes: string[]): void {
  const list = getWatchlist();
  const map = new Map(list.map((i) => [i.code, i]));
  const reordered = codes
    .map((code) => map.get(code))
    .filter((i): i is WatchlistItem => !!i)
    .map((i, idx) => ({ ...i, sortOrder: idx }));
  setWatchlist(reordered);
}

export function getSettings(): AppSettings {
  const stored = get<Partial<AppSettings>>(KEYS.SETTINGS, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function setSettings(partial: Partial<AppSettings>): boolean {
  const current = getSettings();
  return set(KEYS.SETTINGS, { ...current, ...partial });
}

export function resetSettings(): boolean {
  return set(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function getSearchHistory(): SearchHistoryItem[] {
  return get(KEYS.SEARCH_HISTORY, []);
}

export function addSearchHistory(item: SearchHistoryItem): void {
  const list = getSearchHistory();
  const filtered = list.filter((i) => i.query !== item.query);
  const updated = [item, ...filtered].slice(0, STORAGE.MAX_SEARCH_HISTORY);
  set(KEYS.SEARCH_HISTORY, updated);
}

export function clearSearchHistory(): void {
  remove(KEYS.SEARCH_HISTORY);
}

export function getSchemaVersion(): string {
  return get(KEYS.SCHEMA_VERSION, '0.0.0');
}

export function setSchemaVersion(version: string): void {
  set(KEYS.SCHEMA_VERSION, version);
}

export function runMigrations(): void {
  const current = getSchemaVersion();
  if (current === STORAGE.SCHEMA_VERSION) return;
  if (current === '0.0.0') {
    setSchemaVersion('1.0.0');
  }
  window.dispatchEvent(new StorageEvent('storage', { key: KEYS.SCHEMA_VERSION }));
}

export function clearAllStorage(): void {
  Object.values(KEYS).forEach((key) => remove(key));
}
