import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  tone?: 'neutral' | 'gold' | 'burgundy';
};

const toneClasses = {
  neutral: 'bg-cream text-charcoal/75 border-soft-border',
  gold: 'bg-gold/15 text-charcoal border-gold/30',
  burgundy: 'bg-burgundy/10 text-burgundy border-burgundy/20',
};

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
        toneClasses[tone],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
