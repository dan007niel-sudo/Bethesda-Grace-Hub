import { Home, Sparkles, BookOpen, HeartHandshake, HandHeart, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  to: string;
  labelKey: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  { to: '/', labelKey: 'nav.home', icon: Home },
  { to: '/assistant', labelKey: 'nav.assistant', icon: Sparkles },
  { to: '/sermons', labelKey: 'nav.sermons', icon: BookOpen },
  { to: '/ministries', labelKey: 'nav.ministries', icon: HeartHandshake },
  { to: '/prayer', labelKey: 'nav.prayer', icon: HandHeart },
  { to: '/journey', labelKey: 'nav.journey', icon: Compass },
];
