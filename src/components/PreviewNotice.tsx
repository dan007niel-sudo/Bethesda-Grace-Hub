import { Info } from 'lucide-react';
import type { ReactNode } from 'react';

type PreviewNoticeProps = {
  children: ReactNode;
};

export function PreviewNotice({ children }: PreviewNoticeProps) {
  return (
    <div
      role="note"
      className="flex gap-3 items-start rounded-card border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-charcoal"
    >
      <Info size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
