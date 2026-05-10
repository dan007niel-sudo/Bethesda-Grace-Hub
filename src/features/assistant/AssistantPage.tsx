import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, User, Send } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { PreviewNotice } from '../../components/PreviewNotice';
import { PastoralNote } from '../../components/PastoralNote';
import { getAssistantPrompts, type AssistantPrompt } from '../../data/assistant';

type Turn = { role: 'user' | 'assistant'; text: string };

export default function AssistantPage() {
  const { t } = useTranslation();
  const [prompts, setPrompts] = useState<AssistantPrompt[] | null>(null);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [turns, setTurns] = useState<Turn[]>([]);

  useEffect(() => {
    void (async () => {
      setPrompts(await getAssistantPrompts());
    })();
  }, []);

  const remainingPrompts = useMemo(
    () => (prompts ?? []).filter((p) => !used.has(p.id)),
    [prompts, used],
  );

  function handlePrompt(p: AssistantPrompt) {
    setTurns((prev) => [
      ...prev,
      { role: 'user', text: p.prompt },
      { role: 'assistant', text: p.response },
    ]);
    setUsed((prev) => new Set(prev).add(p.id));
  }

  return (
    <div className="py-8 lg:py-10 max-w-2xl">
      <SectionHeader
        level={1}
        title={t('assistant.title')}
        description={t('assistant.description')}
      />

      <PreviewNotice>{t('assistant.previewNotice')}</PreviewNotice>

      {/* Conversation */}
      <div
        className="mt-6 space-y-4"
        role="log"
        aria-live="polite"
        aria-label={t('assistant.title')}
      >
        <Turn role="assistant" label={t('assistant.assistantLabel')}>
          {t('assistant.intro')}
        </Turn>

        {turns.map((turn, i) => (
          <Turn
            key={i}
            role={turn.role}
            label={turn.role === 'user' ? t('assistant.youLabel') : t('assistant.assistantLabel')}
          >
            {turn.text}
          </Turn>
        ))}
      </div>

      {/* Suggested prompts */}
      {remainingPrompts.length > 0 ? (
        <section className="mt-6" aria-labelledby="assistant-suggestions-heading">
          <h2
            id="assistant-suggestions-heading"
            className="text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2"
          >
            {t('assistant.suggestionsHeading')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {remainingPrompts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePrompt(p)}
                className="px-3.5 py-2 rounded-full border border-soft-border bg-white text-sm text-charcoal hover:border-burgundy/40 hover:bg-cream/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
              >
                {p.prompt}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Disabled free-text input — intentional in MVP */}
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-soft-border bg-white px-3.5 py-2.5 opacity-90">
        <input
          type="text"
          disabled
          placeholder={t('assistant.inputPlaceholder')}
          aria-label={t('assistant.inputPlaceholder')}
          className="flex-1 bg-transparent text-sm placeholder:text-charcoal/45 disabled:cursor-not-allowed focus:outline-none"
        />
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label={t('assistant.inputPlaceholder')}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-burgundy/15 text-burgundy/50 disabled:cursor-not-allowed"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6">
        <PastoralNote>{t('assistant.pastoralNote')}</PastoralNote>
      </div>
    </div>
  );
}

function Turn({
  role,
  label,
  children,
}: {
  role: 'user' | 'assistant';
  label: string;
  children: React.ReactNode;
}) {
  const isAssistant = role === 'assistant';
  return (
    <article
      className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse text-right'}`}
      aria-label={label}
    >
      <div
        className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full ${
          isAssistant ? 'bg-burgundy/10 text-burgundy' : 'bg-cream text-charcoal/70'
        }`}
        aria-hidden="true"
      >
        {isAssistant ? <Sparkles size={16} /> : <User size={16} />}
      </div>
      <div
        className={`max-w-[85%] rounded-card px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? 'bg-white border border-soft-border text-charcoal'
            : 'bg-burgundy text-white'
        }`}
      >
        <div
          className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${
            isAssistant ? 'text-charcoal/70' : 'text-white/85'
          }`}
        >
          {label}
        </div>
        <p className="whitespace-pre-line">{children}</p>
      </div>
    </article>
  );
}
