import { sql } from '../db'; // Imports the shared pool from lib/db.ts

export async function createNewTableTable() {
  await sql`
  CREATE TABLE IF NOT EXISTS new_table
  (
    id INT NOT NULL,
    new_column ,
    PRIMARY KEY (id)
  );`;
}
