import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from './Card';
import type { JourneyStep } from '../data/journey';

export function JourneyCard({ step }: { step: JourneyStep }) {
  const to = step.deepLinkTo ?? `/journey/${step.id}`;
  return (
    <Card as="article" padding="md" className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-charcoal">{step.title}</h3>
      <p className="mt-1 text-sm text-charcoal/70 flex-1">{step.shortDescription}</p>
      <div className="mt-4 pt-4 border-t border-soft-border">
        <Link
          to={to}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-burgundy hover:underline"
        >
          {step.nextStepLabel}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
