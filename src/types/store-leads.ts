export type StoreLeadType = 'newsletter' | 'lead' | 'devis';

export type StoreLead = {
  id: number;
  leadType: StoreLeadType | string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  sourcePath?: string | null;
  createdAt: string;
};

export type CreateStoreLeadPayload = {
  leadType: StoreLeadType;
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
  sourcePath?: string;
};
