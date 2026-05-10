import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  as?: 'div' | 'article' | 'section';
  padding?: 'sm' | 'md' | 'lg';
};

const paddingMap = { sm: 'p-4', md: 'p-5', lg: 'p-6' };

export function Card({
  children,
  as: Tag = 'div',
  padding = 'md',
  className = '',
  ...rest
}: CardProps) {
  return (
    <Tag
      className={[
        'bg-white border border-soft-border rounded-card shadow-[var(--shadow-card)]',
        paddingMap[padding],
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
