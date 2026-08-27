import { useState, useMemo } from 'react';
import { getChangeColorClass } from '../utils/formatters';

interface Sector {
  name: string;
  code: string;
  changePercent: number;
  leadingStock?: string;
}

const SECTOR_DATA: Sector[] = [
  { name: '半导体', code: 'bk0496', changePercent: 3.25, leadingStock: '中芯国际' },
  { name: '新能源', code: 'bk0496', changePercent: 2.18, leadingStock: '宁德时代' },
  { name: '白酒', code: 'bk0496', changePercent: -1.05, leadingStock: '贵州茅台' },
  { name: '银行', code: 'bk0496', changePercent: 0.68, leadingStock: '招商银行' },
  { name: '医药', code: 'bk0496', changePercent: -0.82, leadingStock: '恒瑞医药' },
  { name: '房地产', code: 'bk0496', changePercent: 1.45, leadingStock: '万科A' },
  { name: '人工智能', code: 'bk0496', changePercent: 4.12, leadingStock: '科大讯飞' },
  { name: '汽车零部件', code: 'bk0496', changePercent: 1.88, leadingStock: '比亚迪' },
  { name: '通信设备', code: 'bk0496', changePercent: -0.35, leadingStock: '中兴通讯' },
  { name: '电力', code: 'bk0496', changePercent: 0.92, leadingStock: '长江电力' },
];

export function SectorView() {
  const [sortBy, setSortBy] = useState<'change' | 'name'>('change');

  const sortedSectors = useMemo(() => {
    const sorted = [...SECTOR_DATA];
    if (sortBy === 'change') {
      sorted.sort((a, b) => b.changePercent - a.changePercent);
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    }
    return sorted;
  }, [sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 md:py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs md:text-sm text-neutral-400" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          热门板块
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setSortBy('change')} className={`text-[10px] px-2 py-1 border ${sortBy === 'change' ? 'border-pixel-green text-pixel-green' : 'border-neutral-600 text-neutral-400'}`}>
            涨跌幅
          </button>
          <button onClick={() => setSortBy('name')} className={`text-[10px] px-2 py-1 border ${sortBy === 'name' ? 'border-pixel-green text-pixel-green' : 'border-neutral-600 text-neutral-400'}`}>
            名称
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sortedSectors.map((sector) => {
          const colorClass = getChangeColorClass(sector.changePercent);
          return (
            <div key={sector.name} className="flex items-center justify-between bg-neutral-800 border border-neutral-700 p-3 hover:border-neutral-500 transition-colors">
              <div className="flex-1">
                <div className="text-sm text-white">{sector.name}</div>
                {sector.leadingStock && (
                  <div className="text-[10px] text-neutral-500 mt-0.5">龙头: {sector.leadingStock}</div>
                )}
              </div>
              <div className={`text-sm ${colorClass}`} style={{ fontFamily: "'Press Start 2P', monospace" }}>
                {sector.changePercent >= 0 ? '+' : ''}{sector.changePercent.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-neutral-600 mt-4 text-center">演示数据 — 实际部署后将接入实时板块 API</p>
    </div>
  );
}
