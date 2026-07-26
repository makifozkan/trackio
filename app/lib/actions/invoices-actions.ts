'use server';

import { revalidatePath } from 'next/cache';
import { CreateInvoices, UpdateInvoices } from '../validation/InvoicesSchema';
import { createInvoices, updateInvoices, deleteInvoices } from '../db-handlers/invoices-handlers';

export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string | null;
};

/**
 * CREATE ACTION
 */
export async function createInvoicesAction(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into valid base64 strings securely on the server
  

  // Validate inputs with Zod
  const validatedFields = CreateInvoices.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify your fields.',
    };
  }

  try {
    await createInvoices(validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Write Failure. Could not register record.',
    };
  }

  revalidatePath('/dashboard/invoices');

  return {
    success: true,
    message: 'Invoices created successfully!',
  };
}

/**
 * UPDATE ACTION
 */
export async function updateInvoicesAction(
  id: any,
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into base64 strings during modifications
  

  const validatedFields = UpdateInvoices.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify updated fields.',
    };
  }

  try {
    await updateInvoices(id, validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Update Failure. Could not apply modifications.',
    };
  }

  revalidatePath('/dashboard/invoices');

  return {
    success: true,
    message: 'Invoices modifications saved!',
  };
}

/**
 * DELETE ACTION
 */
export async function deleteInvoicesAction(id: any): Promise<ActionState> {
  try {
    await deleteInvoices(id);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Deletion Failure.',
    };
  }

  revalidatePath('/dashboard/invoices');

  return {
    success: true,
    message: 'Invoices record deleted successfully.',
  };
}
