import type { MarketType } from '../types';

export function isValidStockCode(code: string, market?: MarketType): boolean {
  if (!code || code.length < 1 || code.length > 20) return false;
  if (!/^[a-zA-Z0-9\u4e00-\u9fa5.]+$/.test(code)) return false;
  return true;
}

export function sanitizeSearchInput(input: string): string {
  if (!input) return '';
  let sanitized = input.slice(0, 20);
  sanitized = sanitized.replace(/[<>"'&;]/g, '');
  return sanitized;
}

export function isValidPrice(price: unknown): price is number {
  return typeof price === 'number' && !isNaN(price) && price >= 0 && price < 100000;
}

export function isValidChangePercent(percent: number): boolean {
  return percent >= -30 && percent <= 30;
}

export function isValidPollInterval(interval: number): boolean {
  return interval >= 30 && interval <= 300 && interval % 30 === 0;
}
