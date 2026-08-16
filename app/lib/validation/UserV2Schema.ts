import { z } from 'zod';

export const UserV2Schema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: 'name is required.' }),
  email: z
    .string({ required_error: 'Please enter your email.' })
    .email({ message: 'Invalid email address.' }),
  image: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

// View Model Type for the entire form
export type UserV2SchemaType = z.infer<typeof UserV2Schema>;

export const CreateUserV2 = UserV2Schema.omit({ id: true, created_at: true });
export type CreateUserV2Type = z.infer<typeof CreateUserV2>;

export const UpdateUserV2 = UserV2Schema.omit({ id: true });
export type UpdateUserV2Type = z.infer<typeof UpdateUserV2>;
