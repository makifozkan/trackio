import { sql } from '../db';
import { Invoice } from '../types/Invoice'; // Import central type from generate-types.js

export type InvoiceInclude = 'user_v2';

export interface InvoiceFetchOptions {
  include?: InvoiceInclude[];
}

/**
 * FETCH ALL RECORDS
 */
export async function fetchAllInvoices(): Promise<Invoice[]> {
  try {
    const data = (await sql`
      SELECT id, customer_id, amount, status, due_date, user_v2_id
      FROM invoice
    `) as unknown as Invoice[];
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch invoice records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S) (With optional high-performance eager sub-joins)
 */
export async function fetchInvoiceById(id: any, options?: InvoiceFetchOptions): Promise<Invoice | null> {
  try {
    // Array of standard table column select fragments
    const selectFields = [
      sql`t.id`,
      sql`t.customer_id`,
      sql`t.amount`,
      sql`t.status`,
      sql`t.due_date`,
      sql`t.user_v2_id`
    ] as any[];

    // Push relational aggregates dynamically into the SELECT clause
    if (options?.include) {
    if (options?.include?.includes('user_v2')) {
      selectFields.push(sql`(
        SELECT json_build_object('id', r.id, 'name', r.name, 'email', r.email, 'image', r.image, 'created_at', r.created_at)
        FROM user_v2 r
        WHERE r.id = t.user_v2_id
        LIMIT 1
      ) as user_v2`);
    }
    }

    // Execute exactly one single database roundtrip!
    const data = (await sql`
      SELECT ${selectFields}
      FROM invoice t
      WHERE t.id = ${id}
    `) as unknown as Invoice[];
    
    return data[0] || null;
  } catch (error) {
    console.error(`Database Error: Failed to fetch invoice with key(s): `, { id }, error);
    throw new Error('Could not retrieve record.');
  }
}

/**
 * CREATE NEW RECORD
 */
export async function createInvoice(data: Omit<Invoice, 'id'>): Promise<Invoice> {
  try {
    const result = (await sql`
      INSERT INTO invoice (customer_id, amount, status, due_date, user_v2_id)
      VALUES (${data.customer_id ?? null}, ${data.amount ?? null}, ${data.status ?? null}, ${data.due_date ?? null}, ${data.user_v2_id ?? null})
      RETURNING id, customer_id, amount, status, due_date, user_v2_id
    `) as unknown as Invoice[];
    return result[0];
  } catch (error) {
    console.error('Database Error: Failed to create invoice record.', error);
    throw new Error('Could not create record.');
  }
}

/**
 * UPDATE EXISTING RECORD (SAFE PARTIAL UPDATE)
 */
export async function updateInvoice(id: any, data: Partial<Omit<Invoice, 'id'>>): Promise<Invoice> {
  try {
    // If the payload is empty, skip database execution and return the current record
    if (Object.keys(data).length === 0) {
      return (await fetchInvoiceById(id))!;
    }

    // Dynamically filter allowed update keys to exclude any that are undefined
    const allowedKeys = ['customer_id', 'amount', 'status', 'due_date', 'user_v2_id'];
    const keysToUpdate = allowedKeys.filter((key) => (data as any)[key] !== undefined);

    // Resolve column helper using only valid keys
    const updateColumns = sql(data, ...(keysToUpdate as any[])) as any;

    const result = (await sql`
      UPDATE invoice
      SET ${updateColumns}
      WHERE id = ${id}
      RETURNING id, customer_id, amount, status, due_date, user_v2_id
    `) as unknown as Invoice[];

    return result[0];
  } catch (error) {
    console.error(`Database Error: Failed to update invoice with key(s): `, { id }, error);
    throw new Error('Could not update record.');
  }
}

/**
 * DELETE RECORD
 */
export async function deleteInvoice(id: any): Promise<{ success: boolean }> {
  try {
    await sql`
      DELETE FROM invoice
      WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    console.error(`Database Error: Failed to delete invoice with key(s): `, { id }, error);
    throw new Error('Could not delete record.');
  }
}
