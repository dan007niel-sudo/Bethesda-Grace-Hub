import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="text-center py-10 px-6 border border-dashed border-soft-border rounded-card bg-white/40">
      {icon ? (
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream text-burgundy">
          {icon}
        </div>
      ) : null}
      <p className="font-medium text-charcoal">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-charcoal/70 max-w-sm mx-auto">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
