import { sql } from '../db'; // Imports the shared pool from lib/db.ts

export async function createUsersTable() {
  await sql`
  CREATE TABLE IF NOT EXISTS users
  (
    id INT NOT NULL,
    email VARCHAR(255),
    PRIMARY KEY (id)
  );`;
}
