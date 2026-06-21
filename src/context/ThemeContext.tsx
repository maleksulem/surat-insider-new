import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';

export type WorldId = 'wedding' | 'textile' | 'food' | 'weekend' | 'insider';

export interface WorldTheme {
  id: WorldId;
  name: string;
  tagline: string;
  category: string;
  path: string;
  image: string;
  video: string;
  primaryRGB: string;
  secondaryRGB: string;
  accentRGB: string;
  textRGB: string;
  themeCode: 'normal' | 'wedding' | 'vacation' | 'weekend';
}

export const WORLDS: WorldTheme[] = [
  {
    id: 'wedding',
    name: 'Wedding World',
    tagline: 'Vows woven in crimson and gold.',
    category: 'ROUGE HEIRLOOM',
    path: '/wedding',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
    video: 'https://player.vimeo.com/external/432098675.sd.mp4?s=d00e572019c017d838c823bbb7f8b9cb9da76be0&profile_id=165',
    primaryRGB: '139, 0, 0',
    secondaryRGB: '247, 231, 206',
    accentRGB: '204, 119, 34',
    textRGB: '255, 246, 233',
    themeCode: 'wedding',
  },
  {
    id: 'textile',
    name: 'Textile World',
    tagline: 'The loom of an industrial empire.',
    category: 'DIAMOND & WEAVE',
    path: '/textile',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1200&q=80',
    video: 'https://player.vimeo.com/external/454911718.sd.mp4?s=1ef200c9e8fb1ee319fdbce84df1bb623253bcdc&profile_id=165',
    primaryRGB: '44, 62, 102',
    secondaryRGB: '59, 30, 84',
    accentRGB: '192, 196, 204',
    textRGB: '237, 240, 247',
    themeCode: 'normal',
  },
  {
    id: 'food',
    name: 'Culinary World',
    tagline: 'Saffron, smoke and slow fire.',
    category: 'MIDNIGHT BAZAARS',
    path: '/food',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
    video: 'https://player.vimeo.com/external/511520188.sd.mp4?s=813b1fc48bacc64bda682281816e89df9676c0f8&profile_id=165',
    primaryRGB: '217, 164, 65',
    secondaryRGB: '168, 84, 58',
    accentRGB: '111, 78, 55',
    textRGB: '255, 255, 255',
    themeCode: 'weekend',
  },
  {
    id: 'weekend',
    name: 'Coastal World',
    tagline: 'Where black sand meets marine light.',
    category: 'DUMAS COASTAL',
    path: '/weekend',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    video: 'https://player.vimeo.com/external/371438281.sd.mp4?s=231db62f8a846f481be8eb107e371ad52b47e5b5&profile_id=165',
    primaryRGB: '43, 43, 43',
    secondaryRGB: '27, 42, 74',
    accentRGB: '79, 209, 197',
    textRGB: '234, 246, 245',
    themeCode: 'vacation',
  },
  {
    id: 'insider',
    name: 'Insider World',
    tagline: 'Ancient merchant portals and old gates.',
    category: 'SECRET LABYRINTH',
    path: '/insider',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    video: 'https://player.vimeo.com/external/498453535.sd.mp4?s=c8ffda55cd66d338a08892695570facfbaecd186&profile_id=165',
    primaryRGB: '19, 43, 27',
    secondaryRGB: '245, 243, 239',
    accentRGB: '140, 109, 59',
    textRGB: '26, 5, 10',
    themeCode: 'normal',
  },
];

const IDLE_DELAY_MS = 6000;
const AUTO_CYCLE_MS = 4500;

interface ThemeContextValue {
  world: WorldTheme;
  worldIndex: number;
  worlds: WorldTheme[];
  isIdleCycling: boolean;
  setWorldById: (id: WorldId) => void;
  setWorldByIndex: (index: number) => void;
  nextWorld: () => void;
  prevWorld: () => void;
  stopCycling: () => void;
  startCycling: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [worldIndex, setWorldIndex] = useState<number>(0);
  const [isIdleCycling, setIsIdleCycling] = useState<boolean>(false);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isIdleCyclingRef = useRef<boolean>(false);

  const stopCycling = useCallback(() => {
    if (cycleTimerRef.current) {
      clearInterval(cycleTimerRef.current);
      cycleTimerRef.current = null;
    }
    if (isIdleCyclingRef.current) {
      isIdleCyclingRef.current = false;
      setIsIdleCycling(false);
    }
  }, []);

  const startCycling = useCallback(() => {
    if (isIdleCyclingRef.current) return;
    isIdleCyclingRef.current = true;
    setIsIdleCycling(true);

    cycleTimerRef.current = setInterval(() => {
      setWorldIndex((prev) => (prev + 1) % WORLDS.length);
    }, AUTO_CYCLE_MS);
  }, []);

  const scheduleIdle = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      startCycling();
    }, IDLE_DELAY_MS);
  }, [startCycling]);

  const handleActivity = useCallback(() => {
    stopCycling();
    scheduleIdle();
  }, [stopCycling, scheduleIdle]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const events: (keyof WindowEventMap)[] = [
      'mousemove', 'mousedown', 'keydown', 'wheel', 'scroll', 'touchstart', 'touchmove'
    ];

    events.forEach((evt) =>
      window.addEventListener(evt, handleActivity, { passive: true }),
    );

    scheduleIdle();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    };
  }, [handleActivity, scheduleIdle]);

  // Client-safe execution block to map styles safely post-render
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const w = WORLDS[worldIndex];
    const root = document.documentElement;
    
    root.setAttribute('data-world', w.id);
    root.style.setProperty('--world-primary-rgb', w.primaryRGB);
    root.style.setProperty('--world-secondary-rgb', w.secondaryRGB);
    root.style.setProperty('--world-accent-rgb', w.accentRGB);
    root.style.setProperty('--world-text-rgb', w.textRGB);
  }, [worldIndex]);

  const setWorldByIndex = useCallback(
    (index: number) => {
      stopCycling();
      scheduleIdle();
      setWorldIndex(((index % WORLDS.length) + WORLDS.length) % WORLDS.length);
    },
    [stopCycling, scheduleIdle],
  );

  const setWorldById = useCallback(
    (id: WorldId) => {
      const idx = WORLDS.findIndex((w) => w.id === id);
      if (idx !== -1) setWorldByIndex(idx);
    },
    [setWorldByIndex],
  );

  const nextWorld = useCallback(() => setWorldByIndex(worldIndex + 1), [setWorldByIndex, worldIndex]);
  const prevWorld = useCallback(() => setWorldByIndex(worldIndex - 1), [setWorldByIndex, worldIndex]);

  const value: ThemeContextValue = {
    world: WORLDS[worldIndex],
    worldIndex,
    worlds: WORLDS,
    isIdleCycling,
    setWorldById,
    setWorldByIndex,
    nextWorld,
    prevWorld,
    stopCycling,
    startCycling,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
