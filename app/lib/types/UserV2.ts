export type UserV2 = {
  id: string;
  name: string;
  email: string;
  image?: string;
  created_at: string;
  invoices?: Invoice[];
};
