import { Home, Sparkles, HandHeart, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  to: string;
  labelKey: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  { to: '/', labelKey: 'nav.home', icon: Home },
  { to: '/assistant', labelKey: 'nav.ask', icon: Sparkles },
  { to: '/prayer', labelKey: 'nav.pray', icon: HandHeart },
  { to: '/connect', labelKey: 'nav.connect', icon: UsersRound },
];
