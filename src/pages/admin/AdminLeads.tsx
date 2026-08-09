import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Loader2, Mail } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { storeLeadsApi } from '@/services/api/storeLeads';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const LEAD_KEYS: Record<string, AdminMessageKey> = {
  newsletter: 'leads.typeNewsletter',
  lead: 'leads.typeContact',
  devis: 'leads.typeQuote',
};

const localeTag = (locale: string) =>
  locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-GB' : 'fr-MA';

const AdminLeads = () => {
  const { t, locale } = useAdminLocale();
  const [exporting, setExporting] = useState(false);
  const tag = localeTag(locale);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['store-leads'],
    queryFn: () => storeLeadsApi.list(),
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      await storeLeadsApi.exportCsv();
      toast.success(t('leads.exportDone'));
    } catch (err) {
      toastError(err, t('leads.exportError'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout
      title={t('leads.title')}
      breadcrumbs={[{ label: t('leads.breadcrumb') }]}
      description={t('leads.description')}
      actions={
        <Button variant="outline" className="gap-1.5" disabled={exporting} onClick={() => void handleExport()}>
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {t('leads.exportCsv')}
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : leads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {t('leads.empty')}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">{t('common.date')}</th>
                <th className="px-3 py-2 font-medium">{t('common.type')}</th>
                <th className="px-3 py-2 font-medium">{t('common.name')}</th>
                <th className="px-3 py-2 font-medium">{t('common.email')}</th>
                <th className="px-3 py-2 font-medium">{t('common.phone')}</th>
                <th className="px-3 py-2 font-medium">{t('leads.colSource')}</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-border align-top">
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString(tag) : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant="secondary">
                      {LEAD_KEYS[lead.leadType] ? t(LEAD_KEYS[lead.leadType]) : lead.leadType}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">{lead.fullName || '—'}</td>
                  <td className="px-3 py-2">
                    {lead.email ? (
                      <a className="inline-flex items-center gap-1 text-primary hover:underline" href={`mailto:${lead.email}`}>
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-3 py-2">{lead.phone || '—'}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {lead.sourcePath || '—'}
                    {lead.messagePreview ? (
                      <p className="mt-1 max-w-xs font-sans text-foreground">{lead.messagePreview}</p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminLeads;
