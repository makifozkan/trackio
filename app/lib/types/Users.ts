import { Invoices } from './Invoices';

export type Users = {
  id: number;
  name?: string;
  email?: string;
  image?: string;
  created_at?: string;
  invoices?: Invoices[];
};
