import { sql } from '../db';
import { UserV2 } from '../types/UserV2'; // Import central type from generate-types.js

export type UserV2Include = 'invoices';

export interface UserV2FetchOptions {
  include?: UserV2Include[];
}

/**
 * FETCH ALL RECORDS
 */
export async function fetchAllUserV2s(): Promise<UserV2[]> {
  try {
    const data = (await sql`
      SELECT id, name, email, image, created_at
      FROM user_v2
    `) as unknown as UserV2[];
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch user_v2 records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S) (With optional high-performance eager sub-joins)
 */
export async function fetchUserV2ById(
  id: any,
  options?: UserV2FetchOptions
): Promise<UserV2 | null> {
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
        SELECT COALESCE(json_agg(json_build_object('id', r.id, 'customer_id', r.customer_id, 'amount', r.amount, 'status', r.status, 'due_date', r.due_date, 'user_v2_id', r.user_v2_id)), '[]'::json)
        FROM invoice r
        WHERE r.user_v2_id = t.id
      ) as invoices`);
      }
    }

    // Execute exactly one single database roundtrip!
    const data = (await sql`
      SELECT ${selectFields}
      FROM user_v2 t
      WHERE t.id = ${id}
    `) as unknown as UserV2[];

    return data[0] || null;
  } catch (error) {
    console.error(`Database Error: Failed to fetch user_v2 with key(s): `, { id }, error);
    throw new Error('Could not retrieve record.');
  }
}

/**
 * CREATE NEW RECORD
 */
export async function createUserV2(data: Omit<UserV2, 'id'>): Promise<UserV2> {
  try {
    const result = (await sql`
      INSERT INTO user_v2 (name, email, image)
      VALUES (${data.name ?? null}, ${data.email ?? null}, ${data.image ?? null})
      RETURNING id, name, email, image, created_at
    `) as unknown as UserV2[];
    return result[0];
  } catch (error) {
    console.error('Database Error: Failed to create user_v2 record.', error);
    throw new Error('Could not create record.');
  }
}

/**
 * UPDATE EXISTING RECORD (SAFE PARTIAL UPDATE)
 */
export async function updateUserV2(id: any, data: Partial<Omit<UserV2, 'id'>>): Promise<UserV2> {
  try {
    // If the payload is empty, skip database execution and return the current record
    if (Object.keys(data).length === 0) {
      return (await fetchUserV2ById(id))!;
    }

    // Dynamically filter allowed update keys to exclude any that are undefined
    const allowedKeys = ['name', 'email', 'image'];
    const keysToUpdate = allowedKeys.filter((key) => (data as any)[key] !== undefined);

    // Resolve column helper using only valid keys
    const updateColumns = sql(data, ...(keysToUpdate as any[])) as any;

    const result = (await sql`
      UPDATE user_v2
      SET ${updateColumns}
      WHERE id = ${id}
      RETURNING id, name, email, image, created_at
    `) as unknown as UserV2[];

    return result[0];
  } catch (error) {
    console.error(`Database Error: Failed to update user_v2 with key(s): `, { id }, error);
    throw new Error('Could not update record.');
  }
}

/**
 * DELETE RECORD
 */
export async function deleteUserV2(id: any): Promise<{ success: boolean }> {
  try {
    await sql`
      DELETE FROM user_v2
      WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    console.error(`Database Error: Failed to delete user_v2 with key(s): `, { id }, error);
    throw new Error('Could not delete record.');
  }
}
