import { UserV2 } from './UserV2';

export type Invoice = {
  id: number;
  customer_id?: number;
  amount?: number;
  status?: string;
  due_date?: string;
  user_v2_id?: string;
  userv2?: UserV2;
};
