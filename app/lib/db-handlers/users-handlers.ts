import { sql } from '../db';
import { Users } from '../types/Users'; // Import central type from generate-types.js

export type UsersInclude = 'invoices';

export interface UsersFetchOptions {
  include?: UsersInclude[];
}

/**
 * FETCH ALL RECORDS
 */
export async function fetchAllUserss(): Promise<Users[]> {
  try {
    const data = (await sql`
      SELECT id, name, email, image, created_at
      FROM users
    `) as unknown as Users[];
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch users records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S) (With optional high-performance eager sub-joins)
 */
export async function fetchUsersById(id: any, options?: UsersFetchOptions): Promise<Users | null> {
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
        SELECT COALESCE(json_agg(json_build_object('id', r.id, 'customer_id', r.customer_id, 'amount', r.amount, 'status', r.status, 'due_date', r.due_date, 'user_id', r.user_id)), '[]'::json)
        FROM invoices r
        WHERE r.user_id = t.id
      ) as invoices`);
      }
    }

    // Execute exactly one single database roundtrip!
    const data = (await sql`
      SELECT ${selectFields}
      FROM users t
      WHERE t.id = ${id}
    `) as unknown as Users[];

    return data[0] || null;
  } catch (error) {
    console.error(`Database Error: Failed to fetch users with key(s): `, { id }, error);
    throw new Error('Could not retrieve record.');
  }
}

/**
 * CREATE NEW RECORD
 */
export async function createUsers(data: Omit<Users, 'id'>): Promise<Users> {
  try {
    const result = (await sql`
      INSERT INTO users (name, email, image, created_at)
      VALUES (${data.name ?? null}, ${data.email ?? null}, ${data.image ?? null}, ${data.created_at ?? null})
      RETURNING id, name, email, image, created_at
    `) as unknown as Users[];
    return result[0];
  } catch (error) {
    console.error('Database Error: Failed to create users record.', error);
    throw new Error('Could not create record.');
  }
}

/**
 * UPDATE EXISTING RECORD (SAFE PARTIAL UPDATE)
 */
export async function updateUsers(id: any, data: Partial<Omit<Users, 'id'>>): Promise<Users> {
  try {
    // If the payload is empty, skip database execution and return the current record
    if (Object.keys(data).length === 0) {
      return (await fetchUsersById(id))!;
    }

    // Dynamically filter allowed update keys to exclude any that are undefined
    const allowedKeys = ['name', 'email', 'image', 'created_at'];
    const keysToUpdate = allowedKeys.filter((key) => (data as any)[key] !== undefined);

    // Resolve column helper using only valid keys
    const updateColumns = sql(data, ...(keysToUpdate as any[])) as any;

    const result = (await sql`
      UPDATE users
      SET ${updateColumns}
      WHERE id = ${id}
      RETURNING id, name, email, image, created_at
    `) as unknown as Users[];

    return result[0];
  } catch (error) {
    console.error(`Database Error: Failed to update users with key(s): `, { id }, error);
    throw new Error('Could not update record.');
  }
}

/**
 * DELETE RECORD
 */
export async function deleteUsers(id: any): Promise<{ success: boolean }> {
  try {
    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    console.error(`Database Error: Failed to delete users with key(s): `, { id }, error);
    throw new Error('Could not delete record.');
  }
}
