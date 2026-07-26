import { sql } from '../db';
import { Session } from '../types/Session'; // Import central type from generate-types.js

export type SessionInclude = 'user_v2';

export interface SessionFetchOptions {
  include?: SessionInclude[];
}

/**
 * FETCH ALL RECORDS
 */
export async function fetchAllSessions(): Promise<Session[]> {
  try {
    const data = (await sql`
      SELECT id, user_id, session_token, expires, user_v2_id
      FROM session
    `) as unknown as Session[];
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch session records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S) (With optional high-performance eager sub-joins)
 */
export async function fetchSessionById(id: any, options?: SessionFetchOptions): Promise<Session | null> {
  try {
    // Array of standard table column select fragments
    const selectFields = [
      sql`t.id`,
      sql`t.user_id`,
      sql`t.session_token`,
      sql`t.expires`,
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
      FROM session t
      WHERE t.id = ${id}
    `) as unknown as Session[];
    
    return data[0] || null;
  } catch (error) {
    console.error(`Database Error: Failed to fetch session with key(s): `, { id }, error);
    throw new Error('Could not retrieve record.');
  }
}

/**
 * CREATE NEW RECORD
 */
export async function createSession(data: Omit<Session, 'id'>): Promise<Session> {
  try {
    const result = (await sql`
      INSERT INTO session (user_id, session_token, expires, user_v2_id)
      VALUES (${data.user_id ?? null}, ${data.session_token ?? null}, ${data.expires ?? null}, ${data.user_v2_id ?? null})
      RETURNING id, user_id, session_token, expires, user_v2_id
    `) as unknown as Session[];
    return result[0];
  } catch (error) {
    console.error('Database Error: Failed to create session record.', error);
    throw new Error('Could not create record.');
  }
}

/**
 * UPDATE EXISTING RECORD (SAFE PARTIAL UPDATE)
 */
export async function updateSession(id: any, data: Partial<Omit<Session, 'id'>>): Promise<Session> {
  try {
    // If the payload is empty, skip database execution and return the current record
    if (Object.keys(data).length === 0) {
      return (await fetchSessionById(id))!;
    }

    // Dynamically filter allowed update keys to exclude any that are undefined
    const allowedKeys = ['user_id', 'session_token', 'expires', 'user_v2_id'];
    const keysToUpdate = allowedKeys.filter((key) => (data as any)[key] !== undefined);

    // Resolve column helper using only valid keys
    const updateColumns = sql(data, ...(keysToUpdate as any[])) as any;

    const result = (await sql`
      UPDATE session
      SET ${updateColumns}
      WHERE id = ${id}
      RETURNING id, user_id, session_token, expires, user_v2_id
    `) as unknown as Session[];

    return result[0];
  } catch (error) {
    console.error(`Database Error: Failed to update session with key(s): `, { id }, error);
    throw new Error('Could not update record.');
  }
}

/**
 * DELETE RECORD
 */
export async function deleteSession(id: any): Promise<{ success: boolean }> {
  try {
    await sql`
      DELETE FROM session
      WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    console.error(`Database Error: Failed to delete session with key(s): `, { id }, error);
    throw new Error('Could not delete record.');
  }
}
