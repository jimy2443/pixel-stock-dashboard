import { useSettings } from '../context/SettingsContext';
import { PixelButton } from './PixelButton';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useSettings();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-neutral-900 border-l-2 border-neutral-600 h-full overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>设置</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-white text-lg">×</button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-xs text-neutral-400 mb-2">主题</label>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <PixelButton key={t} variant={settings.theme === t ? 'primary' : 'secondary'} size="sm" onClick={() => updateSettings({ theme: t })} className="flex-1">
                    {t === 'light' ? '亮色' : t === 'dark' ? '暗色' : '系统'}
                  </PixelButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-2">刷新间隔: {settings.pollInterval}秒</label>
              <div className="flex gap-2">
                {[30, 60, 120, 300].map((sec) => (
                  <PixelButton key={sec} variant={settings.pollInterval === sec ? 'primary' : 'secondary'} size="sm" onClick={() => updateSettings({ pollInterval: sec })}>
                    {sec}s
                  </PixelButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-2">显示市场</label>
              <div className="space-y-2">
                {[{ key: 'showHkStocks' as const, label: '港股' }, { key: 'showUsStocks' as const, label: '美股' }].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={settings[key]} onChange={(e) => updateSettings({ [key]: e.target.checked })} className="w-4 h-4 accent-pixel-green" />
                    <span className="text-sm text-neutral-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.compactMode} onChange={(e) => updateSettings({ compactMode: e.target.checked })} className="w-4 h-4 accent-pixel-green" />
                <span className="text-sm text-neutral-300">紧凑模式</span>
              </label>
            </div>
            <div className="pt-4 border-t border-neutral-700">
              <PixelButton variant="danger" size="sm" onClick={resetSettings} className="w-full">重置为默认</PixelButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
