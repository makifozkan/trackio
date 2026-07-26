'use server';

import { revalidatePath } from 'next/cache';
import { CreateInvoice, UpdateInvoice } from '../validation/InvoiceSchema';
import { createInvoice, updateInvoice, deleteInvoice } from '../db-handlers/invoice-handlers';

export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string | null;
};

/**
 * CREATE ACTION
 */
export async function createInvoiceAction(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into valid base64 strings securely on the server
  

  // Validate inputs with Zod
  const validatedFields = CreateInvoice.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify your fields.',
    };
  }

  try {
    await createInvoice(validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Write Failure. Could not register record.',
    };
  }

  revalidatePath('/dashboard/invoice');

  return {
    success: true,
    message: 'Invoice created successfully!',
  };
}

/**
 * UPDATE ACTION
 */
export async function updateInvoiceAction(
  id: any,
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into base64 strings during modifications
  

  const validatedFields = UpdateInvoice.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify updated fields.',
    };
  }

  try {
    await updateInvoice(id, validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Update Failure. Could not apply modifications.',
    };
  }

  revalidatePath('/dashboard/invoice');

  return {
    success: true,
    message: 'Invoice modifications saved!',
  };
}

/**
 * DELETE ACTION
 */
export async function deleteInvoiceAction(id: any): Promise<ActionState> {
  try {
    await deleteInvoice(id);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Deletion Failure.',
    };
  }

  revalidatePath('/dashboard/invoice');

  return {
    success: true,
    message: 'Invoice record deleted successfully.',
  };
}
