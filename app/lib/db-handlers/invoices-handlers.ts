import { sql } from '../db';
import { Invoices } from '../types/Invoices'; // Import central type from generate-types.js

export type InvoicesInclude = 'users_v2';

export interface InvoicesFetchOptions {
  include?: InvoicesInclude[];
}

/**
 * FETCH ALL RECORDS
 */
export async function fetchAllInvoicess(): Promise<Invoices[]> {
  try {
    const data = (await sql`
      SELECT id, customer_id, amount, status, due_date, users_v2_id
      FROM invoices
    `) as unknown as Invoices[];
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch invoices records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S) (With optional high-performance eager sub-joins)
 */
export async function fetchInvoicesById(
  id: any,
  options?: InvoicesFetchOptions
): Promise<Invoices | null> {
  try {
    // Array of standard table column select fragments
    const selectFields = [
      sql`t.id`,
      sql`t.customer_id`,
      sql`t.amount`,
      sql`t.status`,
      sql`t.due_date`,
      sql`t.users_v2_id`,
    ] as any[];

    // Push relational aggregates dynamically into the SELECT clause
    if (options?.include) {
      if (options?.include?.includes('users_v2')) {
        selectFields.push(sql`(
        SELECT json_build_object('id', r.id, 'name', r.name, 'email', r.email, 'image', r.image, 'created_at', r.created_at)
        FROM users_v2 r
        WHERE r.id = t.users_v2_id
        LIMIT 1
      ) as users_v2`);
      }
    }

    // Execute exactly one single database roundtrip!
    const data = (await sql`
      SELECT ${selectFields}
      FROM invoices t
      WHERE t.id = ${id}
    `) as unknown as Invoices[];

    return data[0] || null;
  } catch (error) {
    console.error(`Database Error: Failed to fetch invoices with key(s): `, { id }, error);
    throw new Error('Could not retrieve record.');
  }
}

/**
 * CREATE NEW RECORD
 */
export async function createInvoices(data: Omit<Invoices, 'id'>): Promise<Invoices> {
  try {
    const result = (await sql`
      INSERT INTO invoices (customer_id, amount, status, due_date, users_v2_id)
      VALUES (${data.customer_id ?? null}, ${data.amount ?? null}, ${data.status ?? null}, ${data.due_date ?? null}, ${data.users_v2_id ?? null})
      RETURNING id, customer_id, amount, status, due_date, users_v2_id
    `) as unknown as Invoices[];
    return result[0];
  } catch (error) {
    console.error('Database Error: Failed to create invoices record.', error);
    throw new Error('Could not create record.');
  }
}

/**
 * UPDATE EXISTING RECORD (SAFE PARTIAL UPDATE)
 */
export async function updateInvoices(
  id: any,
  data: Partial<Omit<Invoices, 'id'>>
): Promise<Invoices> {
  try {
    // If the payload is empty, skip database execution and return the current record
    if (Object.keys(data).length === 0) {
      return (await fetchInvoicesById(id))!;
    }

    // Dynamically filter allowed update keys to exclude any that are undefined
    const allowedKeys = ['customer_id', 'amount', 'status', 'due_date', 'users_v2_id'];
    const keysToUpdate = allowedKeys.filter((key) => (data as any)[key] !== undefined);

    // Resolve column helper using only valid keys
    const updateColumns = sql(data, ...(keysToUpdate as any[])) as any;

    const result = (await sql`
      UPDATE invoices
      SET ${updateColumns}
      WHERE id = ${id}
      RETURNING id, customer_id, amount, status, due_date, users_v2_id
    `) as unknown as Invoices[];

    return result[0];
  } catch (error) {
    console.error(`Database Error: Failed to update invoices with key(s): `, { id }, error);
    throw new Error('Could not update record.');
  }
}

/**
 * DELETE RECORD
 */
export async function deleteInvoices(id: any): Promise<{ success: boolean }> {
  try {
    await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    console.error(`Database Error: Failed to delete invoices with key(s): `, { id }, error);
    throw new Error('Could not delete record.');
  }
}
