import type { MarketType } from '../types';

export function formatPrice(price: number, market: MarketType): string {
  const formatted = price.toFixed(2);
  if (market === 'us') return `$${formatted}`;
  return `¥${formatted}`;
}

export function formatChangePercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

export function formatChange(change: number, market: MarketType): string {
  const sign = change >= 0 ? '+' : '';
  const formatted = change.toFixed(2);
  if (market === 'us') return `${sign}$${formatted}`;
  return `${sign}¥${formatted}`;
}

export function getChangeColorClass(percent: number, useInverse: boolean = false): string {
  if (useInverse) {
    return percent >= 0 ? 'text-pixel-green' : 'text-pixel-red';
  }
  return percent >= 0 ? 'text-pixel-red' : 'text-pixel-green';
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('zh-CN', { hour12: false });
}

export function formatRelativeTime(date: Date | null): string {
  if (!date) return '从未';
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return '刚刚';
  if (seconds < 60) return `${seconds}秒前`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  return `${hours}小时前`;
}
