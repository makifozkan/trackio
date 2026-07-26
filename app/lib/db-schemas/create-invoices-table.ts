import { sql } from '../db'; // Imports the shared pool from lib/db.ts

export async function createInvoicesTable() {
  await sql`
  CREATE TABLE IF NOT EXISTS invoices
  (
    id SERIAL NOT NULL,
    customer_id INT,
    amount DECIMAL,
    status VARCHAR(255),
    due_date DATE,
    users_v2_id UUID,
    PRIMARY KEY (id)
  );`;
}
