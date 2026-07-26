import { sql } from '../db'; // Imports the shared pool from lib/db.ts

export async function createSessionTable() {
  await sql`
  CREATE TABLE IF NOT EXISTS session
  (
    id UUID NOT NULL,
    user_id UUID,
    session_token TEXT,
    expires TIMESTAMPTZ,
    user_v2_id UUID,
    PRIMARY KEY (id)
  );`;
}
