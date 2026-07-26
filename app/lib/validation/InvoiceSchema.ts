import { z } from 'zod';

export const InvoiceSchema = z.object({
  id: z.coerce.number().optional(),
  customer_id: z.coerce.number().nullable().optional(),
  amount: z.coerce.number().nullable().optional(),
  status: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  user_v2_id: z.string().nullable().optional(),
});

// View Model Type for the entire form
export type InvoiceSchemaType = z.infer<typeof InvoiceSchema>;

export const CreateInvoice = InvoiceSchema.omit({ id: true });
export type CreateInvoiceType = z.infer<typeof CreateInvoice>;

export const UpdateInvoice = InvoiceSchema.omit({ id: true });
export type UpdateInvoiceType = z.infer<typeof UpdateInvoice>;

