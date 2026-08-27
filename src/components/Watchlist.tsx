import { useWatchlist } from '../context/WatchlistContext';
import type { StockQuote } from '../types';
import { StockCard } from './StockCard';
import { LoadingDots } from './LoadingDots';

interface WatchlistProps {
  quotes: StockQuote[];
  isLoading: boolean;
  isError: boolean;
}

export function Watchlist({ quotes, isLoading, isError }: WatchlistProps) {
  const { items, remove } = useWatchlist();
  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  const quoteMap = new Map(quotes.map((q) => [q.code, q]));

  if (sortedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24 text-neutral-500">
        <div className="text-4xl md:text-6xl mb-4 opacity-30" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          📈
        </div>
        <p className="text-sm md:text-base mb-4">添加你的第一只股票</p>
        <p className="text-xs text-neutral-600">点击右上角搜索按钮开始</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 md:py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs md:text-sm text-neutral-400" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          自选股 ({sortedItems.length})
        </h2>
        {isLoading && (
          <div className="flex items-center gap-2 text-neutral-500 text-xs">
            <LoadingDots />
            <span>刷新中</span>
          </div>
        )}
        {isError && !isLoading && <span className="text-xs text-pixel-amber">数据可能过期</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {sortedItems.map((item) => {
          const quote = quoteMap.get(item.code);
          if (!quote) {
            return (
              <div key={item.code} className="border-2 border-neutral-700 bg-neutral-800 p-3 md:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-neutral-500">{item.code}</span>
                </div>
                <div className="text-xs text-neutral-400 mb-2">{item.name}</div>
                <div className="text-xs text-neutral-600">加载中...</div>
              </div>
            );
          }
          return <StockCard key={item.code} quote={quote} onDelete={remove} />;
        })}
      </div>
    </div>
  );
}
