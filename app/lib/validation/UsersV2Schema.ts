import { z } from 'zod';

export const UsersV2Schema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: 'name is required.' }),
  email: z
    .string({ required_error: 'Please enter your email.' })
    .email({ message: 'Invalid email address.' }),
  image: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

// View Model Type for the entire form
export type UsersV2SchemaType = z.infer<typeof UsersV2Schema>;

export const CreateUsersV2 = UsersV2Schema.omit({ id: true, created_at: true });
export type CreateUsersV2Type = z.infer<typeof CreateUsersV2>;

export const UpdateUsersV2 = UsersV2Schema.omit({ id: true });
export type UpdateUsersV2Type = z.infer<typeof UpdateUsersV2>;
