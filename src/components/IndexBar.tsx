import type { IndexQuote } from '../types';
import { formatPrice, formatChangePercent, getChangeColorClass } from '../utils/formatters';

interface IndexBarProps {
  indices: IndexQuote[];
  isLoading?: boolean;
}

export function IndexBar({ indices, isLoading }: IndexBarProps) {
  if (isLoading && indices.length === 0) {
    return (
      <div className="border-b-2 border-neutral-700 bg-neutral-900 p-3">
        <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs">
          <span className="animate-pulse">加载指数中...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="border-b-2 border-neutral-700 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-3 py-2 md:py-3">
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          {indices.map((idx) => {
            const colorClass = getChangeColorClass(idx.changePercent);
            return (
              <div key={idx.symbol} className="flex items-center gap-2 md:gap-3">
                <span className="text-[10px] md:text-xs text-neutral-400">{idx.name}</span>
                <span className="text-xs md:text-sm text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  {formatPrice(idx.price, 'a-sh')}
                </span>
                <span className={`text-[10px] md:text-xs ${colorClass}`}>{formatChangePercent(idx.changePercent)}</span>
              </div>
            );
          })}
          {indices.length === 0 && !isLoading && <span className="text-xs text-neutral-500">指数数据暂不可用</span>}
        </div>
      </div>
    </div>
  );
}
