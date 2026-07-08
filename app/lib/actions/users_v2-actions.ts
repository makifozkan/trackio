'use server';

import { revalidatePath } from 'next/cache';
import { CreateUsersV2, UpdateUsersV2 } from '../validation/UsersV2Schema';
import { createUsersV2, updateUsersV2, deleteUsersV2 } from '../db-handlers/users_v2-handlers';

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
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into valid base64 strings securely on the server
  
  const imageFile = formData.get('image');
  if (imageFile instanceof File && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    rawFields.image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
  } else {
    // Correct: Completely strip empty files or null boundaries so Zod and Postgres ignore them during updates
    delete rawFields.image;
  }

  // Validate inputs with Zod
  const validatedFields = CreateUsersV2.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify your fields.',
    };
  }

  try {
    await createUsersV2(validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Write Failure. Could not register record.',
    };
  }

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
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into base64 strings during modifications
  
  const imageFile = formData.get('image');
  if (imageFile instanceof File && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    rawFields.image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
  } else {
    // Correct: Completely strip empty files or null boundaries so Zod and Postgres ignore them during updates
    delete rawFields.image;
  }

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
    console.error('Action Error:', error);
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
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Deletion Failure.',
    };
  }

  revalidatePath('/dashboard/users_v2');

  return {
    success: true,
    message: 'UsersV2 record deleted successfully.',
  };
}
