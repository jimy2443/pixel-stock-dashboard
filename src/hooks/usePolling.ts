import { useState, useEffect, useRef, useCallback } from 'react';
import type { UsePollingOptions, UsePollingResult } from '../types';

export function usePolling<T>({
  fetcher, interval, enabled = true, onError,
}: UsePollingOptions<T>): UsePollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const intervalRef = useRef(interval);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const consecutiveFailuresRef = useRef(0);
  const currentIntervalRef = useRef(interval * 1000);
  const isRunningRef = useRef(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    intervalRef.current = interval;
    if (!isRunningRef.current) currentIntervalRef.current = interval * 1000;
  }, [interval]);

  const execute = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      setLastUpdated(new Date());
      consecutiveFailuresRef.current = 0;
      currentIntervalRef.current = intervalRef.current * 1000;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setIsError(true);
      setError(e);
      consecutiveFailuresRef.current++;
      if (onError) onError(e, consecutiveFailuresRef.current);
      if (consecutiveFailuresRef.current >= 3) {
        currentIntervalRef.current = Math.min(currentIntervalRef.current * 2, 300000);
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [fetcher, onError]);

  const refresh = useCallback(() => { execute(); }, [execute]);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      isRunningRef.current = false;
      return;
    }
    isRunningRef.current = true;
    execute();
    const runInterval = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => { execute(); }, currentIntervalRef.current);
    };
    runInterval();
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      } else { runInterval(); }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      isRunningRef.current = false;
    };
  }, [enabled, execute]);

  return { data, isLoading, isError, error, lastUpdated, refresh };
}
