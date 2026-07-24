export type SocialNetworkKey = 'facebook' | 'instagram' | 'tiktok' | 'whatsapp';

export interface SocialNetworkDTO {
  id: number;
  networkKey: SocialNetworkKey | string;
  label: string;
  url: string;
  enabled: boolean;
  displayOrder: number;
}
