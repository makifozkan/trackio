'use server';

import { revalidatePath } from 'next/cache';
import { CreateUsersV2, UpdateUsersV2 } from '../validation/UsersV2Schema';
import { createUsersV2, updateUsersV2, deleteUsersV2 } from '../db-handlers/users_v2-handlers';

// Standard state payload structure returned to Next.js form state hooks
export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string | null;
};

/**
 * CREATE ACTION
 */
export async function createUsersV2Action(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Convert form inputs to structured JSON object
  const rawFields = Object.fromEntries(formData.entries());

  // 2. Validate inputs with Zod
  const validatedFields = CreateUsersV2.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify your fields.',
    };
  }

  // 3. Write data to PostgreSQL
  try {
    await createUsersV2(validatedFields.data as any);
  } catch (error) {
    console.error('Action Error: Failed to create users_v2 record.', error);
    return {
      success: false,
      message: 'Database Write Failure. Could not register record.',
    };
  }

  // 4. Force Next.js App Router cache to refresh for this page path
  revalidatePath('/dashboard/users_v2');

  return {
    success: true,
    message: 'UsersV2 created successfully!',
  };
}

/**
 * UPDATE ACTION
 */
export async function updateUsersV2Action(
  id: any,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawFields = Object.fromEntries(formData.entries());

  // Validate inputs with Zod (using the Omit schema)
  const validatedFields = UpdateUsersV2.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify updated fields.',
    };
  }

  try {
    await updateUsersV2(id, validatedFields.data as any);
  } catch (error) {
    console.error('Action Error: Failed to update users_v2 record.', error);
    return {
      success: false,
      message: 'Database Update Failure. Could not apply modifications.',
    };
  }

  revalidatePath('/dashboard/users_v2');

  return {
    success: true,
    message: 'UsersV2 modifications saved!',
  };
}

/**
 * DELETE ACTION
 */
export async function deleteUsersV2Action(id: any): Promise<ActionState> {
  try {
    await deleteUsersV2(id);
  } catch (error) {
    console.error('Action Error: Failed to delete users_v2 record.', error);
    return {
      success: false,
      message: 'Database Deletion Failure. Action rolled back.',
    };
  }

  revalidatePath('/dashboard/users_v2');

  return {
    success: true,
    message: 'UsersV2 record deleted successfully.',
  };
}
