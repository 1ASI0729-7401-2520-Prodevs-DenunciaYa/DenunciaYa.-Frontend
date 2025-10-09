export interface DirectoryEntity {
  id: string;
  name: string;
  type: string;
  district: string;
  category: string;
  address: string;
  attentionHours: string;
  phone?: string;
  email?: string;
  website?: string;
  services: string[];
}
