import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { WatchlistItem } from '../types';
import { getWatchlist, addToWatchlist as storageAdd, removeFromWatchlist as storageRemove, reorderWatchlist as storageReorder } from '../storage/storage';

interface WatchlistContextValue {
  items: WatchlistItem[];
  isLoading: boolean;
  add: (item: WatchlistItem) => { success: boolean; reason?: string };
  remove: (code: string) => void;
  reorder: (codes: string[]) => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WatchlistItem[]>(() => getWatchlist());
  const [isLoading] = useState(false);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.includes('watchlist')) setItems(getWatchlist());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const add = useCallback((item: WatchlistItem) => {
    const result = storageAdd(item);
    if (result.success) setItems(getWatchlist());
    return result;
  }, []);

  const remove = useCallback((code: string) => {
    storageRemove(code);
    setItems(getWatchlist());
  }, []);

  const reorder = useCallback((codes: string[]) => {
    storageReorder(codes);
    setItems(getWatchlist());
  }, []);

  const value = useMemo(() => ({ items, isLoading, add, remove, reorder }), [items, isLoading, add, remove, reorder]);

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
