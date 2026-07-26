import { apiRequest, buildApiUrl } from '@/config/api';

export type AiCopyKind = 'seo_title' | 'seo_description' | 'hero' | 'faq' | 'cta';
export type AiCopyTone = 'pro' | 'friendly' | 'luxury';

export type AiCopyGeneratePayload = {
  kind: AiCopyKind;
  topic: string;
  storeName?: string;
  tone?: AiCopyTone;
};

export const aiCopyApi = {
  generate: (payload: AiCopyGeneratePayload) =>
    apiRequest<Record<string, unknown>>(buildApiUrl('/ai-copy/generate'), {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
