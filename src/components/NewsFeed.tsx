import { useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
}

const NEWS_DATA: NewsItem[] = [
  { id: '1', title: '沪指放量突破 3300 点，成交额创近期新高', source: '新浪财经', time: '10:32' },
  { id: '2', title: '美联储暗示 9 月可能暂停加息，美股全线收涨', source: '财联社', time: '09:45' },
  { id: '3', title: '半导体板块午后持续走强，多只ETF涨超 4%', source: '东方财富', time: '14:18' },
  { id: '4', title: '北向资金净流入超 50 亿元，重点加仓新能源', source: '证券时报', time: '11:20' },
  { id: '5', title: '央行开展 1000 亿元逆回购操作，维护流动性合理充裕', source: '上海证券报', time: '08:55' },
];

interface NewsFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsFeed({ isOpen, onClose }: NewsFeedProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-neutral-900 border-l-2 border-neutral-600 h-full overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>大盘要闻</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-white text-lg">×</button>
          </div>
          <div className="space-y-3">
            {NEWS_DATA.map((news) => (
              <div key={news.id} className="bg-neutral-800 border border-neutral-700 p-3 cursor-pointer hover:border-neutral-500 transition-colors" onClick={() => setExpandedId(expandedId === news.id ? null : news.id)}>
                <div className="text-sm text-neutral-200 leading-relaxed">{news.title}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-pixel-amber">{news.source}</span>
                  <span className="text-[10px] text-neutral-600">{news.time}</span>
                </div>
                {expandedId === news.id && (
                  <div className="mt-2 pt-2 border-t border-neutral-700 text-xs text-neutral-400">点击跳转查看详情（演示数据）</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-neutral-600 mt-4 text-center">演示数据 — 实际部署后将接入实时资讯 RSS</p>
        </div>
      </div>
    </div>
  );
}
