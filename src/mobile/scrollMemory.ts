import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_KEY = 'forum.mobile.scroll-memory';
const MAX_ENTRIES = 60;
const RESTORE_DELAYS = [0, 50, 140, 280, 520, 900, 1500, 2400, 3600];

type ScrollMemoryStore = {
  pendingRestorePositions: Map<string, number>;
  scrollPositions: Map<string, number>;
  storageLoaded: boolean;
};

const fallbackStore: ScrollMemoryStore = {
  pendingRestorePositions: new Map<string, number>(),
  scrollPositions: new Map<string, number>(),
  storageLoaded: false,
};

const getStore = (): ScrollMemoryStore => {
  if (typeof window === 'undefined') return fallbackStore;
  const globalWindow = window as typeof window & {
    __forumMobileScrollMemory?: ScrollMemoryStore;
  };
  if (!globalWindow.__forumMobileScrollMemory) {
    globalWindow.__forumMobileScrollMemory = {
      pendingRestorePositions: new Map<string, number>(),
      scrollPositions: new Map<string, number>(),
      storageLoaded: false,
    };
  }
  return globalWindow.__forumMobileScrollMemory;
};

const loadStorage = () => {
  const store = getStore();
  if (store.storageLoaded || typeof window === 'undefined') return;
  store.storageLoaded = true;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const entries = JSON.parse(raw) as Array<[string, number]>;
    entries.forEach(([key, value]) => {
      if (key && Number.isFinite(value)) {
        store.scrollPositions.set(key, Math.max(0, value));
      }
    });
  } catch {
    // Ignore broken session data; scroll memory is a convenience only.
  }
};

const persistStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    const entries = Array.from(getStore().scrollPositions.entries()).slice(-MAX_ENTRIES);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage can be unavailable in embedded browsers.
  }
};

const getScrollTop = () =>
  window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

const getMaxScrollTop = () =>
  Math.max(0, document.documentElement.scrollHeight, document.body.scrollHeight) -
  window.innerHeight;

const normalizeTop = (value: number) => Math.max(0, Math.round(value));

export const getMobileScrollMemoryKey = (pathname: string, search = '') =>
  `${pathname}${search}`;

export const getCurrentMobileScrollTop = () => getScrollTop();

export const getMobileSavedScrollPosition = (key: string) => {
  loadStorage();
  return key ? getStore().scrollPositions.get(key) || 0 : 0;
};

export const saveMobileScrollPosition = (
  key: string,
  top = getScrollTop(),
  options?: { keepExistingWhenTopReset?: boolean },
) => {
  loadStorage();
  if (!key) return;
  const { scrollPositions } = getStore();
  const nextTop = normalizeTop(top);
  const existingTop = scrollPositions.get(key) || 0;
  if (options?.keepExistingWhenTopReset && nextTop < existingTop && existingTop > 1) {
    persistStorage();
    return;
  }
  scrollPositions.set(key, nextTop);
  if (scrollPositions.size > MAX_ENTRIES) {
    const firstKey = scrollPositions.keys().next().value;
    if (firstKey) scrollPositions.delete(firstKey);
  }
  persistStorage();
};

export const requestMobileScrollRestore = (key: string) => {
  loadStorage();
  const { pendingRestorePositions, scrollPositions } = getStore();
  const top = key ? scrollPositions.get(key) || 0 : 0;
  if (top > 1) pendingRestorePositions.set(key, normalizeTop(top));
};

export const useMobileScrollMemory = ({
  key,
  enabled = true,
  restoreToken,
  restoreOnPush = false,
}: {
  key?: string;
  enabled?: boolean;
  restoreToken?: string | number | boolean;
  restoreOnPush?: boolean;
} = {}) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const memoryKey = key || getMobileScrollMemoryKey(location.pathname, location.search);
  const routeState = location.state as
    | {
        restoreScrollKey?: string;
        restoreScrollTop?: number;
      }
    | null
    | undefined;
  const routeRestoreKey = routeState?.restoreScrollKey || '';
  const routeRestoreTop = routeState?.restoreScrollTop || 0;
  const restoreLockUntilRef = useRef(0);
  const restoreRequestRef = useRef<{ locationKey: string; targetTop: number } | null>(
    null,
  );
  const restoreTokenValue = useMemo(() => String(restoreToken ?? ''), [restoreToken]);

  const scheduleRestore = () => {
    const request = restoreRequestRef.current;
    if (!request || request.locationKey !== location.key) return undefined;

    const timers: number[] = [];
    restoreLockUntilRef.current = Date.now() + RESTORE_DELAYS.at(-1)! + 160;

    const restore = () => {
      if (
        !restoreRequestRef.current ||
        restoreRequestRef.current.locationKey !== request.locationKey
      ) {
        return;
      }
      const nextTop = Math.min(request.targetTop, getMaxScrollTop());
      window.scrollTo(0, nextTop);
      if (nextTop >= request.targetTop - 2) {
        restoreRequestRef.current = null;
      }
    };

    RESTORE_DELAYS.forEach((delay) => {
      const timer = window.setTimeout(() => {
        window.requestAnimationFrame(restore);
      }, delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;
    loadStorage();
    let frame = 0;
    const save = () => {
      frame = 0;
      if (Date.now() < restoreLockUntilRef.current) return;
      saveMobileScrollPosition(memoryKey);
    };
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(save);
    };
    const handlePageHide = () =>
      saveMobileScrollPosition(memoryKey, getScrollTop(), {
        keepExistingWhenTopReset: true,
      });
    const handlePossibleNavigation = (event: MouseEvent | PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('button, a, [role="button"]')) {
        const top = getScrollTop();
        saveMobileScrollPosition(memoryKey, top);
        getStore().pendingRestorePositions.set(memoryKey, normalizeTop(top));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('pointerdown', handlePossibleNavigation, {
      capture: true,
      passive: true,
    });
    document.addEventListener('click', handlePossibleNavigation, {
      capture: true,
      passive: true,
    });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('pointerdown', handlePossibleNavigation, {
        capture: true,
      });
      document.removeEventListener('click', handlePossibleNavigation, {
        capture: true,
      });
      saveMobileScrollPosition(memoryKey, getScrollTop(), {
        keepExistingWhenTopReset: true,
      });
    };
  }, [enabled, memoryKey]);

  useLayoutEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      restoreRequestRef.current = null;
      return undefined;
    }
    loadStorage();
    const { pendingRestorePositions, scrollPositions } = getStore();
    const stateTop =
      routeRestoreKey === memoryKey ? normalizeTop(routeRestoreTop || 0) : 0;
    const pendingTop = stateTop || pendingRestorePositions.get(memoryKey) || 0;
    const isRequestedPushRestore =
      restoreOnPush && navigationType !== 'POP' && pendingTop > 1;
    if (navigationType !== 'POP' && !isRequestedPushRestore) {
      restoreRequestRef.current = null;
      return undefined;
    }
    if (location.key === 'default' && pendingTop <= 1) {
      restoreRequestRef.current = null;
      return undefined;
    }
    const targetTop = pendingTop || scrollPositions.get(memoryKey) || 0;
    if (targetTop <= 1) return undefined;
    pendingRestorePositions.delete(memoryKey);

    restoreRequestRef.current = {
      locationKey: location.key,
      targetTop,
    };

    return scheduleRestore();
  }, [
    enabled,
    memoryKey,
    navigationType,
    location.key,
    restoreOnPush,
    routeRestoreKey,
    routeRestoreTop,
  ]);

  useLayoutEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;
    return scheduleRestore();
  }, [enabled, location.key, restoreTokenValue]);
};
