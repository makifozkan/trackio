'use server';

import { revalidatePath } from 'next/cache';
import { CreateSession, UpdateSession } from '../validation/SessionSchema';
import { createSession, updateSession, deleteSession } from '../db-handlers/session-handlers';

export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string | null;
};

/**
 * CREATE ACTION
 */
export async function createSessionAction(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into valid base64 strings securely on the server
  

  // Validate inputs with Zod
  const validatedFields = CreateSession.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify your fields.',
    };
  }

  try {
    await createSession(validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Write Failure. Could not register record.',
    };
  }

  revalidatePath('/dashboard/session');

  return {
    success: true,
    message: 'Session created successfully!',
  };
}

/**
 * UPDATE ACTION
 */
export async function updateSessionAction(
  id: any,
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into base64 strings during modifications
  

  const validatedFields = UpdateSession.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify updated fields.',
    };
  }

  try {
    await updateSession(id, validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Update Failure. Could not apply modifications.',
    };
  }

  revalidatePath('/dashboard/session');

  return {
    success: true,
    message: 'Session modifications saved!',
  };
}

/**
 * DELETE ACTION
 */
export async function deleteSessionAction(id: any): Promise<ActionState> {
  try {
    await deleteSession(id);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Deletion Failure.',
    };
  }

  revalidatePath('/dashboard/session');

  return {
    success: true,
    message: 'Session record deleted successfully.',
  };
}
