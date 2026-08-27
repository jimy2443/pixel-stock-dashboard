import type { StockQuote, IndexQuote } from '../types';
import { API_BASE, POLLING } from '../utils/constants';
import { isValidPrice, isValidChangePercent } from '../utils/validators';

function parseSinaQuote(code: string, raw: string): StockQuote | null {
  if (!raw || raw === '') return null;
  const parts = raw.split(',');
  if (parts.length < 5) return null;
  const name = parts[0] || code;
  const currentPrice = parseFloat(parts[3] || '0');
  const prevClose = parseFloat(parts[2] || '0');
  if (!isValidPrice(currentPrice)) return null;
  const change = currentPrice - prevClose;
  const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
  if (!isValidChangePercent(changePercent)) return null;
  const market = code.startsWith('sh') ? 'a-sh' : 'a-sz';
  return {
    code, name, market, price: currentPrice, change, changePercent,
    updateTime: new Date().toISOString(),
  };
}

export async function fetchStockQuotes(codes: string[]): Promise<StockQuote[]> {
  if (codes.length === 0) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), POLLING.TIMEOUT_MS);
  try {
    const url = `${API_BASE.SINA}/list=${codes.join(',')}`;
    const response = await fetch(url, { signal: controller.signal, headers: { Referer: 'https://finance.sina.com.cn' } });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Sina API error: ${response.status}`);
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(buffer);
    const quotes: StockQuote[] = [];
    for (const code of codes) {
      const regex = new RegExp(`var hq_str_${code}="([^"]*)"`);
      const match = text.match(regex);
      if (match) {
        const quote = parseSinaQuote(code, match[1]);
        if (quote) quotes.push(quote);
      }
    }
    return quotes;
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === 'AbortError') throw new Error('Sina API timeout');
    throw error;
  }
}

export async function fetchIndexQuotes(symbols: string[]): Promise<IndexQuote[]> {
  if (symbols.length === 0) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), POLLING.TIMEOUT_MS);
  try {
    const url = `${API_BASE.SINA}/list=${symbols.join(',')}`;
    const response = await fetch(url, { signal: controller.signal, headers: { Referer: 'https://finance.sina.com.cn' } });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Sina API error: ${response.status}`);
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(buffer);
    const indices: IndexQuote[] = [];
    for (const symbol of symbols) {
      const regex = new RegExp(`var hq_str_${symbol}="([^"]*)"`);
      const match = text.match(regex);
      if (match) {
        const parts = match[1].split(',');
        if (parts.length >= 3) {
          const name = parts[0] || symbol;
          const price = parseFloat(parts[1] || '0');
          const prevClose = parseFloat(parts[2] || '0');
          if (isValidPrice(price)) {
            const change = price - prevClose;
            const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
            if (isValidChangePercent(changePercent)) {
              indices.push({ symbol, name, price, change, changePercent });
            }
          }
        }
      }
    }
    return indices;
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === 'AbortError') throw new Error('Sina API timeout');
    throw error;
  }
}

interface YahooChartResponse {
  chart?: {
    result?: Array<{ meta: { regularMarketPrice: number; previousClose: number; shortName?: string; symbol: string } }>;
    error?: { description: string };
  };
}

export async function fetchUsStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  if (symbols.length === 0) return [];
  const quotes: StockQuote[] = [];
  for (const symbol of symbols) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), POLLING.TIMEOUT_MS);
    try {
      const url = `${API_BASE.YAHOO}/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) { if (response.status === 429) console.warn(`[Yahoo] Rate limited for ${symbol}`); continue; }
      const data: YahooChartResponse = await response.json();
      const result = data.chart?.result?.[0];
      if (!result) continue;
      const { meta } = result;
      const price = meta.regularMarketPrice;
      const prevClose = meta.previousClose;
      if (!isValidPrice(price)) continue;
      const change = price - prevClose;
      const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
      if (!isValidChangePercent(changePercent)) continue;
      quotes.push({ code: symbol, name: meta.shortName || symbol, market: 'us', price, change, changePercent, updateTime: new Date().toISOString() });
    } catch (error) {
      clearTimeout(timeout);
      console.warn(`[Yahoo] Error fetching ${symbol}:`, error);
    }
  }
  return quotes;
}
