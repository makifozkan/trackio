import { z } from 'zod';

export const InvoicesSchema = z.object({
  id: z.coerce.number().optional(),
  customer_id: z.coerce.number().nullable().optional(),
  amount: z.coerce.number().nullable().optional(),
  status: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  users_v2_id: z.string().nullable().optional(),
});

// View Model Type for the entire form
export type InvoicesSchemaType = z.infer<typeof InvoicesSchema>;

export const CreateInvoices = InvoicesSchema.omit({ id: true });
export type CreateInvoicesType = z.infer<typeof CreateInvoices>;

export const UpdateInvoices = InvoicesSchema.omit({ id: true });
export type UpdateInvoicesType = z.infer<typeof UpdateInvoices>;

