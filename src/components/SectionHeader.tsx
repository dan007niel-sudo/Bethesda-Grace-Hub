import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  level?: 1 | 2 | 3;
};

export function SectionHeader({ title, description, action, level = 2 }: SectionHeaderProps) {
  const Heading = (`h${level}` as 'h1' | 'h2' | 'h3');
  const titleSize =
    level === 1 ? 'text-3xl' : level === 2 ? 'text-xl' : 'text-base';
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div className="min-w-0">
        <Heading className={`${titleSize} font-semibold text-charcoal`}>{title}</Heading>
        {description ? (
          <p className="mt-1 text-sm text-charcoal/70">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
