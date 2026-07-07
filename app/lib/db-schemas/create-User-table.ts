import { sql } from '../db'; // Imports the shared pool from lib/db.ts

export async function createUserTable() {
  await sql`
  CREATE TABLE IF NOT EXISTS User
  (
    id INT NOT NULL,
    email VARCHAR(255),
    firstName VARCHAR(255),
    PRIMARY KEY (id)
  );`;
}
