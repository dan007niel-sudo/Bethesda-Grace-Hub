import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { PreviewNotice } from '../../components/PreviewNotice';
import { getAdminSection, type AdminSection } from '../../data/admin';

export default function AdminSectionPage() {
  const { section: sectionId } = useParams();
  const { t } = useTranslation();
  const [section, setSection] = useState<AdminSection | null | undefined>(undefined);

  useEffect(() => {
    void (async () => {
      if (!sectionId) {
        setSection(null);
        return;
      }
      setSection((await getAdminSection(sectionId)) ?? null);
    })();
  }, [sectionId]);

  if (section === undefined) {
    return <p className="py-8 text-sm text-charcoal/70">{t('common.loading')}</p>;
  }

  if (section === null) {
    return (
      <div className="py-10">
        <EmptyState
          title={t('admin.notFound')}
          action={
            <Link to="/admin-preview" className="text-sm text-burgundy hover:underline">
              {t('admin.backToAdmin')}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-10">
      <Link
        to="/admin-preview"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal/70 hover:text-burgundy"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {t('admin.backToAdmin')}
      </Link>

      <header className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-charcoal">{section.title}</h1>
          <p className="mt-1 text-charcoal/70">{section.description}</p>
        </div>
        <Badge tone="gold">{t('admin.readOnlyBadge')}</Badge>
      </header>

      <div className="mt-6">
        <PreviewNotice>{t('admin.helper')}</PreviewNotice>
      </div>

      <Card padding="sm" className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-charcoal/70 border-b border-soft-border">
              {section.columns.map((c) => (
                <th key={c} scope="col" className="px-3 py-2 whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr key={i} className="border-b border-soft-border last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2.5 text-charcoal/85 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="mt-4 text-xs text-charcoal/70">
        {t('admin.rowsCount', { count: section.rows.length })}
      </p>
    </div>
  );
}
