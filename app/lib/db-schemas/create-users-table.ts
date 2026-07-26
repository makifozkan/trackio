import { sql } from '../db'; // Imports the shared pool from lib/db.ts

export async function createUsersTable() {
  await sql`
  CREATE TABLE IF NOT EXISTS users
  (
    id SERIAL NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    image TEXT,
    created_at TIMESTAMPTZ,
    PRIMARY KEY (id)
  );`;
}
