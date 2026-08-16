import { sql } from '../db';
import { UsersV2 } from '../types/UsersV2'; // Import central type from generate-types.js

export type UsersV2Include = 'invoices';

export interface UsersV2FetchOptions {
  include?: UsersV2Include[];
}

/**
 * FETCH ALL RECORDS
 */
export async function fetchAllUsersV2s(): Promise<UsersV2[]> {
  try {
    const data = (await sql`
      SELECT id, name, email, image, created_at
      FROM users_v2
    `) as unknown as UsersV2[];
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch users_v2 records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S) (With optional high-performance eager sub-joins)
 */
export async function fetchUsersV2ById(
  id: any,
  options?: UsersV2FetchOptions
): Promise<UsersV2 | null> {
  try {
    // Array of standard table column select fragments
    const selectFields = [
      sql`t.id`,
      sql`t.name`,
      sql`t.email`,
      sql`t.image`,
      sql`t.created_at`,
    ] as any[];

    // Push relational aggregates dynamically into the SELECT clause
    if (options?.include) {
      if (options?.include?.includes('invoices')) {
        selectFields.push(sql`(
        SELECT COALESCE(json_agg(json_build_object('id', r.id, 'customer_id', r.customer_id, 'amount', r.amount, 'status', r.status, 'due_date', r.due_date, 'users_v2_id', r.users_v2_id)), '[]'::json)
        FROM invoices r
        WHERE r.users_v2_id = t.id
      ) as invoices`);
      }
    }

    // Execute exactly one single database roundtrip!
    const data = (await sql`
      SELECT ${selectFields}
      FROM users_v2 t
      WHERE t.id = ${id}
    `) as unknown as UsersV2[];

    return data[0] || null;
  } catch (error) {
    console.error(`Database Error: Failed to fetch users_v2 with key(s): `, { id }, error);
    throw new Error('Could not retrieve record.');
  }
}

/**
 * CREATE NEW RECORD
 */
export async function createUsersV2(data: Omit<UsersV2, 'id'>): Promise<UsersV2> {
  try {
    const result = (await sql`
      INSERT INTO users_v2 (name, email, image)
      VALUES (${data.name ?? null}, ${data.email ?? null}, ${data.image ?? null})
      RETURNING id, name, email, image, created_at
    `) as unknown as UsersV2[];
    return result[0];
  } catch (error) {
    console.error('Database Error: Failed to create users_v2 record.', error);
    throw new Error('Could not create record.');
  }
}

/**
 * UPDATE EXISTING RECORD (SAFE PARTIAL UPDATE)
 */
export async function updateUsersV2(id: any, data: Partial<Omit<UsersV2, 'id'>>): Promise<UsersV2> {
  try {
    // If the payload is empty, skip database execution and return the current record
    if (Object.keys(data).length === 0) {
      return (await fetchUsersV2ById(id))!;
    }

    // Dynamically filter allowed update keys to exclude any that are undefined
    const allowedKeys = ['name', 'email', 'image'];
    const keysToUpdate = allowedKeys.filter((key) => (data as any)[key] !== undefined);

    // Resolve column helper using only valid keys
    const updateColumns = sql(data, ...(keysToUpdate as any[])) as any;

    const result = (await sql`
      UPDATE users_v2
      SET ${updateColumns}
      WHERE id = ${id}
      RETURNING id, name, email, image, created_at
    `) as unknown as UsersV2[];

    return result[0];
  } catch (error) {
    console.error(`Database Error: Failed to update users_v2 with key(s): `, { id }, error);
    throw new Error('Could not update record.');
  }
}

/**
 * DELETE RECORD
 */
export async function deleteUsersV2(id: any): Promise<{ success: boolean }> {
  try {
    await sql`
      DELETE FROM users_v2
      WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    console.error(`Database Error: Failed to delete users_v2 with key(s): `, { id }, error);
    throw new Error('Could not delete record.');
  }
}
