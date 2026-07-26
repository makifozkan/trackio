export type Invoices = {
  id: number;
  customer_id?: number;
  amount?: number;
  status?: string;
  due_date?: string;
  users_v2_id?: string;
  usersv2?: UsersV2;
};
