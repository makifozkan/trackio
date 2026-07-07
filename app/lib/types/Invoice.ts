export type Invoice = {
  id: string;
  customerId: string;
  amount: number;
  status: "paid" | "pending" | "void";
  dueDate: string;
};
