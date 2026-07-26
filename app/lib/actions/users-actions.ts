'use server';

import { revalidatePath } from 'next/cache';
import { CreateUsers, UpdateUsers } from '../validation/UsersSchema';
import { createUsers, updateUsers, deleteUsers } from '../db-handlers/users-handlers';

export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string | null;
};

/**
 * CREATE ACTION
 */
export async function createUsersAction(
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
  const validatedFields = CreateUsers.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify your fields.',
    };
  }

  try {
    await createUsers(validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Write Failure. Could not register record.',
    };
  }

  revalidatePath('/dashboard/users');

  return {
    success: true,
    message: 'Users created successfully!',
  };
}

/**
 * UPDATE ACTION
 */
export async function updateUsersAction(
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

  const validatedFields = UpdateUsers.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify updated fields.',
    };
  }

  try {
    await updateUsers(id, validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Update Failure. Could not apply modifications.',
    };
  }

  revalidatePath('/dashboard/users');

  return {
    success: true,
    message: 'Users modifications saved!',
  };
}

/**
 * DELETE ACTION
 */
export async function deleteUsersAction(id: any): Promise<ActionState> {
  try {
    await deleteUsers(id);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Deletion Failure.',
    };
  }

  revalidatePath('/dashboard/users');

  return {
    success: true,
    message: 'Users record deleted successfully.',
  };
}
