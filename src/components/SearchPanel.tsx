import { useState, useCallback } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import type { SearchResult, MarketType } from '../types';
import { PixelButton } from './PixelButton';
import { LoadingDots } from './LoadingDots';
import { sanitizeSearchInput } from '../utils/validators';
import { MARKETS } from '../utils/constants';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const STOCK_DB: SearchResult[] = [
  { code: 'sh600519', name: '贵州茅台', market: 'a-sh', matchType: 'exact' },
  { code: 'sz000001', name: '平安银行', market: 'a-sz', matchType: 'exact' },
  { code: 'sz300750', name: '宁德时代', market: 'a-sz', matchType: 'exact' },
  { code: 'sh600036', name: '招商银行', market: 'a-sh', matchType: 'exact' },
  { code: 'sz002594', name: '比亚迪', market: 'a-sz', matchType: 'exact' },
  { code: 'sh688981', name: '中芯国际', market: 'a-sh', matchType: 'exact' },
  { code: 'sh600900', name: '长江电力', market: 'a-sh', matchType: 'exact' },
  { code: 'sz000858', name: '五粮液', market: 'a-sz', matchType: 'exact' },
  { code: 'sh601318', name: '中国平安', market: 'a-sh', matchType: 'exact' },
  { code: 'AAPL', name: 'Apple Inc.', market: 'us', matchType: 'exact' },
  { code: 'TSLA', name: 'Tesla Inc.', market: 'us', matchType: 'exact' },
  { code: 'MSFT', name: 'Microsoft', market: 'us', matchType: 'exact' },
  { code: 'NVDA', name: 'NVIDIA', market: 'us', matchType: 'exact' },
  { code: 'BABA', name: 'Alibaba', market: 'us', matchType: 'exact' },
];

function searchStocks(query: string): SearchResult[] {
  const sanitized = sanitizeSearchInput(query).toLowerCase();
  if (!sanitized) return [];
  const results: SearchResult[] = [];
  const seen = new Set<string>();
  for (const stock of STOCK_DB) {
    if (seen.has(stock.code)) continue;
    const codeLower = stock.code.toLowerCase();
    const nameLower = stock.name.toLowerCase();
    if (codeLower === sanitized || nameLower === sanitized) {
      results.unshift({ ...stock, matchType: 'exact' });
      seen.add(stock.code);
    } else if (codeLower.startsWith(sanitized) || nameLower.startsWith(sanitized)) {
      results.push({ ...stock, matchType: 'prefix' });
      seen.add(stock.code);
    } else if (codeLower.includes(sanitized) || nameLower.includes(sanitized)) {
      results.push({ ...stock, matchType: 'fuzzy' });
      seen.add(stock.code);
    }
  }
  return results.slice(0, 10);
}

export function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { add } = useWatchlist();

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (!value.trim()) { setResults([]); return; }
    setIsSearching(true);
    const found = searchStocks(value);
    setResults(found);
    setIsSearching(false);
  }, []);

  const handleAdd = useCallback((result: SearchResult) => {
    const item = { code: result.code, name: result.name, market: result.market as MarketType, addedAt: new Date().toISOString(), sortOrder: Date.now() };
    const res = add(item);
    if (res.success) { setQuery(''); setResults([]); onClose(); }
  }, [add, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-neutral-900 border-l-2 border-neutral-600 h-full overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>搜索股票</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-white text-lg">×</button>
          </div>
          <div className="mb-4">
            <input type="text" value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="输入代码或名称..." maxLength={20}
              className="w-full bg-neutral-800 border-2 border-neutral-600 text-white px-3 py-2 text-sm outline-none focus:border-pixel-green placeholder:text-neutral-600" autoFocus />
          </div>
          <div>
            {isSearching && <div className="flex justify-center py-8"><LoadingDots /></div>}
            {!isSearching && query && results.length === 0 && <div className="text-center py-8 text-neutral-500 text-sm">未找到匹配股票</div>}
            {!isSearching && results.length > 0 && (
              <div className="space-y-2">
                {results.map((result) => (
                  <div key={result.code} className="flex items-center justify-between bg-neutral-800 border border-neutral-700 p-3">
                    <div>
                      <div className="text-sm text-white">{result.name}</div>
                      <div className="text-xs text-neutral-400">{result.code} · {MARKETS[result.market]?.label || result.market}</div>
                    </div>
                    <PixelButton variant="primary" size="sm" onClick={() => handleAdd(result)}>+</PixelButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
