import { sql } from '../db';
import { UsersV2 } from '../types/UsersV2'; // Import central type from generate-types.js

/**
 * FETCH ALL RECORDS
 */
export async function fetchAllUsersV2s(): Promise<UsersV2[]> {
  try {
    const data = await sql<UsersV2[]>`
      SELECT id, name, email, image, created_at
      FROM users_v2
    `;
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch users_v2 records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S)
 */
export async function fetchUsersV2ById(id: any): Promise<UsersV2 | null> {
  try {
    const data = await sql<UsersV2[]>`
      SELECT id, name, email, image, created_at
      FROM users_v2
      WHERE id = ${id}
    `;
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
    const result = await sql<UsersV2[]>`
      INSERT INTO users_v2 (name, email, image, created_at)
      VALUES (${data.name}, ${data.email}, ${data.image}, ${data.created_at})
      RETURNING id, name, email, image, created_at
    `;
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

    const result = await sql<UsersV2[]>`
      UPDATE users_v2
      SET ${sql(data, ...(['name', 'email', 'image', 'created_at'] as any[]))}
      WHERE id = ${id}
      RETURNING id, name, email, image, created_at
    `;
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
