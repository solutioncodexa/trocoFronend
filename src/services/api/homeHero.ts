import { buildApiUrl, apiRequest } from '@/config/api';

export type HomeHeroSettingsDTO = {
  /** Première image (compat). */
  imageUrl: string;
  imageUrls: string[];
};

export const homeHeroApi = {
  getPublic: () =>
    apiRequest<HomeHeroSettingsDTO>(buildApiUrl('/home-hero/public')),

  update: (data: { imageUrls: string[]; imageUrl?: string }) =>
    apiRequest<HomeHeroSettingsDTO>(buildApiUrl('/home-hero'), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
