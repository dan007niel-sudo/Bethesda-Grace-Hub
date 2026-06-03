import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Circle } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { getCompletedDays, toggleDay, currentStreak } from '../../lib/readingPlan';

type PlanDay = { reference: string; theme: string };

export default function ReadingPlanPage() {
  const { t } = useTranslation();
  const plan = t('reading.plan', { returnObjects: true }) as PlanDay[];
  const [completed, setCompleted] = useState<number[]>(() => getCompletedDays());

  const total = plan.length;
  const done = completed.length;
  const completedSet = new Set(completed);
  const streak = currentStreak(completed);
  const allDone = done >= total;
  // The "today" day is the lowest index not yet completed. When all days are
  // done, there is no today row (and we show the completed-all message).
  const todayIndex = allDone ? -1 : plan.findIndex((_, index) => !completedSet.has(index));
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  function handleToggle(index: number) {
    setCompleted(toggleDay(index));
  }

  return (
    <div className="py-8 lg:py-10 max-w-2xl space-y-6">
      <SectionHeader
        level={1}
        title={t('reading.title')}
        description={t('reading.description')}
      />

      <Card padding="md">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-charcoal">
            {t('reading.progress', { done, total })}
          </p>
          <span className="inline-flex items-center rounded-full bg-burgundy/10 text-burgundy px-2 py-0.5 text-xs font-medium">
            {t('reading.streak', { count: streak })}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={t('reading.progress', { done, total })}
          className="mt-3 h-2 w-full rounded-full bg-soft-border overflow-hidden"
        >
          <div
            className="h-full rounded-full bg-burgundy transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </Card>

      {allDone ? (
        <Card padding="md">
          <p className="text-sm text-charcoal/80 leading-relaxed">{t('reading.completedAll')}</p>
        </Card>
      ) : null}

      <Card padding="sm">
        <ul className="divide-y divide-soft-border">
          {plan.map((day, index) => {
            const isDone = completedSet.has(index);
            const isToday = index === todayIndex;
            return (
              <li key={day.reference} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <button
                  type="button"
                  aria-pressed={isDone}
                  aria-label={t(isDone ? 'reading.markIncomplete' : 'reading.markComplete', {
                    day: index + 1,
                  })}
                  onClick={() => handleToggle(index)}
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
                >
                  {isDone ? (
                    <Check size={18} aria-hidden="true" className="text-burgundy" />
                  ) : (
                    <Circle size={18} aria-hidden="true" className="text-charcoal/70" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase tracking-wide text-charcoal/70">
                      {t('reading.dayLabel', { day: index + 1 })}
                    </span>
                    {isToday ? (
                      <span className="inline-flex items-center rounded-full bg-burgundy/10 text-burgundy px-2 py-0.5 text-xs font-medium">
                        {t('reading.todayBadge')}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 font-medium text-burgundy">{day.reference}</p>
                  <p className="mt-0.5 text-sm text-charcoal/70">{day.theme}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
