import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Lock } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { PreviewNotice } from '../../components/PreviewNotice';
import { getAdminSections, type AdminSection } from '../../data/admin';

export default function AdminPreviewPage() {
  const { t } = useTranslation();
  const [sections, setSections] = useState<AdminSection[] | null>(null);

  useEffect(() => {
    void (async () => {
      setSections(await getAdminSections());
    })();
  }, []);

  return (
    <div className="py-8 lg:py-10">
      <div className="flex items-center gap-2 mb-2">
        <Lock size={14} className="text-charcoal/70" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wider text-charcoal/70">
          {t('admin.title')}
        </span>
      </div>
      <SectionHeader
        level={1}
        title={t('admin.title')}
        description={t('admin.helper')}
      />

      <PreviewNotice>{t('admin.helper')}</PreviewNotice>

      {sections === null ? (
        <p className="mt-6 text-sm text-charcoal/70">{t('common.loading')}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Card key={s.id} as="article" padding="md" className="flex flex-col h-full">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-charcoal">{s.title}</h3>
                <Badge>{t('admin.readOnlyBadge')}</Badge>
              </div>
              <p className="mt-1 text-sm text-charcoal/70 flex-1">{s.description}</p>
              <p className="mt-3 text-xs text-charcoal/70">
                {t('admin.rowsCount', { count: s.rows.length })}
              </p>
              <div className="mt-4 pt-4 border-t border-soft-border">
                <Link
                  to={`/admin-preview/${s.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-burgundy hover:underline"
                >
                  {t('admin.openSection')}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
