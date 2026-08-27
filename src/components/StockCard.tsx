import type { StockQuote } from '../types';
import { formatPrice, formatChangePercent, formatChange, getChangeColorClass } from '../utils/formatters';

interface StockCardProps {
  quote: StockQuote;
  onDelete?: (code: string) => void;
}

export function StockCard({ quote, onDelete }: StockCardProps) {
  const colorClass = getChangeColorClass(quote.changePercent);
  return (
    <div className="relative border-2 border-neutral-600 bg-neutral-800 p-3 md:p-4 hover:border-neutral-400 transition-colors duration-150">
      {onDelete && (
        <button onClick={() => onDelete(quote.code)} className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-pixel-red text-xs leading-none transition-colors" aria-label={`删除 ${quote.name}`}>
          ×
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] md:text-xs text-neutral-400 font-mono uppercase tracking-wider" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          {quote.code}
        </span>
        <span className="text-[10px] px-1 py-0.5 bg-neutral-700 text-neutral-300">
          {quote.market === 'a-sh' ? '沪' : quote.market === 'a-sz' ? '深' : quote.market === 'hk' ? '港' : '美'}
        </span>
      </div>
      <div className="text-xs md:text-sm text-neutral-200 mb-3 truncate" style={{ fontFamily: "system-ui, sans-serif" }}>
        {quote.name}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-sm md:text-lg text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          {formatPrice(quote.price, quote.market)}
        </span>
        <div className="text-right">
          <div className={`text-xs md:text-sm ${colorClass}`} style={{ fontFamily: "'Press Start 2P', monospace" }}>
            {formatChangePercent(quote.changePercent)}
          </div>
          <div className={`text-[10px] md:text-xs ${colorClass} opacity-80`}>
            {formatChange(quote.change, quote.market)}
          </div>
        </div>
      </div>
    </div>
  );
}
