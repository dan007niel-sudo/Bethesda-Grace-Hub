import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { PastoralNote } from '../../components/PastoralNote';
import { PreviewNotice } from '../../components/PreviewNotice';
import { FormField, FormGroup } from '../../components/FormField';
import { Button } from '../../components/Button';

const PRAYER_EMAIL = 'prayer@bethesdagracehub.example';

type Visibility = 'private' | 'shared';

type Errors = Partial<Record<'name' | 'contact' | 'request', string>>;

export default function PrayerPage() {
  const { t } = useTranslation();
  const visibilityGroupId = useId();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [request, setRequest] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = t('prayer.form.errors.name');
    if (!contact.trim()) next.contact = t('prayer.form.errors.contact');
    if (!request.trim()) next.request = t('prayer.form.errors.request');
    return next;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const visibilityLabel =
      visibility === 'private'
        ? t('prayer.form.visibilityPrivate')
        : t('prayer.form.visibilityShared');
    const subject = `${t('prayer.subjectPrefix')} — ${name.trim()}`;
    const body = [
      `${t('prayer.form.name')}: ${name.trim()}`,
      `${t('prayer.form.contact')}: ${contact.trim()}`,
      `${t('prayer.form.visibility')}: ${visibilityLabel}`,
      '',
      `${t('prayer.form.request')}:`,
      request.trim(),
    ].join('\n');

    const url = `mailto:${PRAYER_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  function handleCancel() {
    setName('');
    setContact('');
    setRequest('');
    setVisibility('private');
    setErrors({});
  }

  return (
    <div className="py-8 lg:py-10 max-w-2xl">
      <SectionHeader
        level={1}
        title={t('prayer.title')}
        description={t('prayer.description')}
      />

      <PastoralNote>{t('prayer.pastoralNote')}</PastoralNote>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <FormGroup>
          <FormField
            label={t('prayer.form.name')}
            placeholder={t('prayer.form.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={errors.name}
            autoComplete="name"
          />
          <FormField
            label={t('prayer.form.contact')}
            placeholder={t('prayer.form.contactPlaceholder')}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            error={errors.contact}
            autoComplete="email"
          />
          <FormField
            as="textarea"
            label={t('prayer.form.request')}
            placeholder={t('prayer.form.requestPlaceholder')}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            required
            error={errors.request}
          />

          <fieldset
            aria-labelledby={visibilityGroupId}
            aria-describedby={`${visibilityGroupId}-hint`}
            className="space-y-2"
          >
            <legend
              id={visibilityGroupId}
              className="text-sm font-medium text-charcoal mb-1.5 px-0"
            >
              {t('prayer.form.visibility')}
            </legend>
            <label className="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-soft-border bg-white cursor-pointer hover:border-burgundy/40">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                onChange={() => setVisibility('private')}
                className="mt-1 accent-burgundy"
              />
              <span className="text-sm text-charcoal">
                {t('prayer.form.visibilityPrivate')}
              </span>
            </label>
            <label className="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-soft-border bg-white cursor-pointer hover:border-burgundy/40">
              <input
                type="radio"
                name="visibility"
                value="shared"
                checked={visibility === 'shared'}
                onChange={() => setVisibility('shared')}
                className="mt-1 accent-burgundy"
              />
              <span className="text-sm text-charcoal">
                {t('prayer.form.visibilityShared')}
              </span>
            </label>
            <p
              id={`${visibilityGroupId}-hint`}
              className="text-xs text-charcoal/70"
            >
              {t('prayer.form.visibilityHint')}
            </p>
          </fieldset>
        </FormGroup>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="submit" variant="primary">
            <Mail size={16} aria-hidden="true" />
            {t('prayer.form.submit')}
          </Button>
          <Button type="button" variant="ghost" onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <PreviewNotice>{t('prayer.mailtoNote')}</PreviewNotice>
      </div>
    </div>
  );
}
