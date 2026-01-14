/**
 * Client-side hook for refreshing data
 * Forces re-fetch of data after mutations
 */

'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export function useRefresh() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      router.refresh();
      // Small delay to ensure server has processed
      await new Promise(resolve => setTimeout(resolve, 100));
    } finally {
      setIsRefreshing(false);
    }
  }, [router]);

  return { refresh, isRefreshing };
}

/**
 * Auto-refresh hook that refreshes after a delay
 */
export function useAutoRefresh(delayMs: number = 2000) {
  const router = useRouter();

  const scheduleRefresh = useCallback(() => {
    setTimeout(() => {
      router.refresh();
    }, delayMs);
  }, [router, delayMs]);

  return { scheduleRefresh };
}
