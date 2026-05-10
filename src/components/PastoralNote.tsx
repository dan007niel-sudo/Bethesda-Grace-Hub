import { HandHeart } from 'lucide-react';
import type { ReactNode } from 'react';

type PastoralNoteProps = {
  children: ReactNode;
};

export function PastoralNote({ children }: PastoralNoteProps) {
  return (
    <div
      role="note"
      className="flex gap-3 items-start rounded-card border border-burgundy/20 bg-burgundy/[0.04] px-4 py-3 text-sm text-charcoal"
    >
      <HandHeart size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden="true" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
