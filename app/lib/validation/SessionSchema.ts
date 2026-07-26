import { z } from 'zod';

export const SessionSchema = z.object({
  id: z.string({ required_error: 'id is required.' }),
  user_id: z.string().nullable().optional(),
  session_token: z.string().nullable().optional(),
  expires: z.string().nullable().optional(),
  user_v2_id: z.string().nullable().optional(),
});

// View Model Type for the entire form
export type SessionSchemaType = z.infer<typeof SessionSchema>;

export const CreateSession = SessionSchema;
export type CreateSessionType = z.infer<typeof CreateSession>;

export const UpdateSession = SessionSchema.omit({ id: true });
export type UpdateSessionType = z.infer<typeof UpdateSession>;

