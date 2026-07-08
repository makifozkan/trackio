import { sql } from '../db';
import { User } from '../types/User'; // Import central type from generate-types.js

/**
 * FETCH ALL RECORDS
 */
export async function fetchAllUsers(): Promise<User[]> {
  try {
    const data = await sql<User[]>`
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
export async function fetchUserById(id: any): Promise<User | null> {
  try {
    const data = await sql<User[]>`
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
export async function createUser(data: Omit<User, 'id'>): Promise<User> {
  try {
    const result = await sql<User[]>`
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
export async function updateUser(id: any, data: Partial<Omit<User, 'id'>>): Promise<User> {
  try {
    const result = await sql<User[]>`
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
export async function deleteUser(id: any): Promise<{ success: boolean }> {
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
