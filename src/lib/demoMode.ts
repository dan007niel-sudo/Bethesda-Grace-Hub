import { useEffect, useState } from 'react';
import type { Devotional } from './devotional';

const DEMO_STORAGE_KEY = 'bethesda-grace-hub-demo-mode';

// In visitor-preview mode, HomePage renders verse/reference/reflection from i18n
// (home.scriptureVerse / home.scriptureRef / home.devotional.demoReflection), so these
// literal strings are never shown — they exist to satisfy the Devotional shape and
// trigger the populated hero block.
export const DEMO_DEVOTIONAL: Devotional = {
  date: 'demo',
  verse:
    'For all have sinned, and come short of the glory of God; Being justified freely by his grace through the redemption that is in Christ Jesus.',
  reference: 'Romans 3:23-24',
  reflection:
    'This visitor preview uses a prepared devotional so no live assistant request is made. It shows the experience without changing church data or sending anything.',
};

export function readDemoMode(): boolean {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  const explicit = params.get('demo');

  if (explicit === '0') {
    window.sessionStorage.removeItem(DEMO_STORAGE_KEY);
    return false;
  }

  if (explicit === '1' || window.location.pathname === '/demo') {
    window.sessionStorage.setItem(DEMO_STORAGE_KEY, '1');
    return true;
  }

  return window.sessionStorage.getItem(DEMO_STORAGE_KEY) === '1';
}

export function useDemoMode(): boolean {
  const [demoMode, setDemoMode] = useState(readDemoMode);

  useEffect(() => {
    setDemoMode(readDemoMode());
  }, []);

  return demoMode;
}
