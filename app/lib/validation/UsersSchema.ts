import { z } from 'zod';

export const UsersSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().nullable().optional(),
  email: z.string().email().optional(),
  image: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
});

// View Model Type for the entire form
export type UsersSchemaType = z.infer<typeof UsersSchema>;

export const CreateUsers = UsersSchema.omit({ id: true });
export type CreateUsersType = z.infer<typeof CreateUsers>;

export const UpdateUsers = UsersSchema.omit({ id: true });
export type UpdateUsersType = z.infer<typeof UpdateUsers>;
