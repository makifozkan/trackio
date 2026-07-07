import { sql } from '../db';

export type DbUser = {
  id: number;
  email: string;
  firstName: string;
};

/**
 * FETCH ALL RECORDS
 */
export async function fetchAllUsers(): Promise<DbUser[]> {
  try {
    const data = await sql<DbUser[]>`
      SELECT id, email, firstName
      FROM User
    `;
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch User records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S)
 */
export async function fetchUserById(id: number): Promise<DbUser | null> {
  try {
    const data = await sql<DbUser[]>`
      SELECT id, email, firstName
      FROM User
      WHERE id = ${id}
    `;
    return data[0] || null;
  } catch (error) {
    console.error(`Database Error: Failed to fetch User with key(s): `, { id }, error);
    throw new Error('Could not retrieve record.');
  }
}

/**
 * CREATE NEW RECORD
 */
export async function createUser(data: Omit<DbUser, 'id'>): Promise<DbUser> {
  try {
    const result = await sql<DbUser[]>`
      INSERT INTO User (email, firstName)
      VALUES (${data.email}, ${data.firstName})
      RETURNING id, email, firstName
    `;
    return result[0];
  } catch (error) {
    console.error('Database Error: Failed to create User record.', error);
    throw new Error('Could not create record.');
  }
}

/**
 * UPDATE EXISTING RECORD (SAFE PARTIAL UPDATE)
 */
export async function updateUser(id: number, data: Partial<Omit<DbUser, 'id'>>): Promise<DbUser> {
  try {
    const result = await sql<DbUser[]>`
      UPDATE User
      SET
      email = ${data.email !== undefined ? data.email : sql`${email}`},
      firstName = ${data.firstName !== undefined ? data.firstName : sql`${firstName}`}
      WHERE id = ${id}
      RETURNING id, email, firstName
    `;
    return result[0];
  } catch (error) {
    console.error(`Database Error: Failed to update User with key(s): `, { id }, error);
    throw new Error('Could not update record.');
  }
}

/**
 * DELETE RECORD
 */
export async function deleteUser(id: number): Promise<{ success: boolean }> {
  try {
    await sql`
      DELETE FROM User
      WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    console.error(`Database Error: Failed to delete User with key(s): `, { id }, error);
    throw new Error('Could not delete record.');
  }
}
