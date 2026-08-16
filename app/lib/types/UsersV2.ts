import { Invoices } from './Invoices';

export type UsersV2 = {
  id: string;
  name: string;
  email: string;
  image?: string;
  created_at: string;
  invoices?: Invoices[];
};
