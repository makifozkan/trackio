import { sql } from '../db'; // Imports the shared pool from lib/db.ts

export async function createUsersV2Table() {
  await sql`
  CREATE TABLE IF NOT EXISTS users_v2
  (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  );`;
}
