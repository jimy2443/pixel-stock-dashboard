import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { getSettings, setSettings, resetSettings } from '../storage/storage';

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setState] = useState<AppSettings>(() => getSettings());

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.includes('settings')) setState(getSettings());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (settings.theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setState(getSettings());
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [settings.theme]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(partial);
    setState(getSettings());
  }, []);

  const handleReset = useCallback(() => {
    resetSettings();
    setState(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo(() => ({ settings, updateSettings, resetSettings: handleReset }), [settings, updateSettings, handleReset]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
