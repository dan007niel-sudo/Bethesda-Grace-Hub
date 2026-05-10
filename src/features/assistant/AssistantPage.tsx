import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, User, Send } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { PreviewNotice } from '../../components/PreviewNotice';
import { PastoralNote } from '../../components/PastoralNote';
import { getAssistantPrompts, type AssistantPrompt } from '../../data/assistant';
import {
  askGraceAssistant,
  isAssistantConfigured,
  type AssistantTurn,
} from '../../lib/assistant';

type DisplayTurn = { role: 'user' | 'assistant'; text: string };

export default function AssistantPage() {
  const { t } = useTranslation();
  const [prompts, setPrompts] = useState<AssistantPrompt[] | null>(null);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [turns, setTurns] = useState<DisplayTurn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      setPrompts(await getAssistantPrompts());
    })();
  }, []);

  // Scroll to the latest turn after it's added.
  useEffect(() => {
    conversationRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [turns.length, busy]);

  const remainingPrompts = useMemo(
    () => (prompts ?? []).filter((p) => !used.has(p.id)),
    [prompts, used],
  );

  async function send(message: string) {
    setError(null);
    setTurns((prev) => [...prev, { role: 'user', text: message }]);
    setBusy(true);

    if (!isAssistantConfigured) {
      // Fallback: look up the suggested prompt's mock response if it matches.
      const match = (prompts ?? []).find((p) => p.prompt === message);
      const reply =
        match?.response ??
        "The assistant isn't connected yet. Please try one of the suggested questions for now.";
      setTimeout(() => {
        setTurns((prev) => [...prev, { role: 'assistant', text: reply }]);
        setBusy(false);
      }, 250);
      return;
    }

    const history: AssistantTurn[] = turns.map((tn) => ({
      role: tn.role === 'user' ? 'user' : 'model',
      text: tn.text,
    }));

    try {
      const reply = await askGraceAssistant(message, history);
      setTurns((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (e) {
      console.error(e);
      setError(t('assistant.errorGeneric'));
    } finally {
      setBusy(false);
    }
  }

  function handlePrompt(p: AssistantPrompt) {
    setUsed((prev) => new Set(prev).add(p.id));
    void send(p.prompt);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    void send(text);
  }

  const inputDisabled = busy;

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

        {busy ? (
          <Turn role="assistant" label={t('assistant.assistantLabel')}>
            <span className="inline-flex items-center gap-1 text-charcoal/60">
              <Dot delay={0} />
              <Dot delay={150} />
              <Dot delay={300} />
              <span className="ml-2 text-xs">{t('assistant.thinking')}</span>
            </span>
          </Turn>
        ) : null}

        {error ? (
          <p role="alert" className="text-sm text-burgundy">
            {error}
          </p>
        ) : null}
        <div ref={conversationRef} />
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
                disabled={busy}
                className="px-3.5 py-2 rounded-full border border-soft-border bg-white text-sm text-charcoal hover:border-burgundy/40 hover:bg-cream/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
              >
                {p.prompt}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Free-text input */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex items-center gap-2 rounded-xl border border-soft-border bg-white px-3.5 py-2.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={inputDisabled || !isAssistantConfigured}
          placeholder={
            isAssistantConfigured
              ? t('assistant.inputPlaceholder')
              : t('assistant.inputPlaceholderDisabled')
          }
          aria-label={t('assistant.inputPlaceholder')}
          className="flex-1 bg-transparent text-sm text-charcoal placeholder:text-charcoal/45 disabled:cursor-not-allowed focus:outline-none"
        />
        <button
          type="submit"
          disabled={inputDisabled || !isAssistantConfigured || !input.trim()}
          aria-label={t('assistant.send')}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-burgundy text-white hover:bg-burgundy/90 disabled:bg-burgundy/30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </form>

      <div className="mt-6">
        <PastoralNote>{t('assistant.pastoralNote')}</PastoralNote>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full bg-charcoal/50 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    />
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
        <div className="whitespace-pre-line">{children}</div>
      </div>
    </article>
  );
}
