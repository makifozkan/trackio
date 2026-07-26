import { sql } from '../db'; // Imports the shared pool from lib/db.ts

export async function createInvoiceTable() {
  await sql`
  CREATE TABLE IF NOT EXISTS invoice
  (
    id SERIAL NOT NULL,
    customer_id INT,
    amount DECIMAL,
    status VARCHAR(255),
    due_date DATE,
    user_v2_id UUID,
    PRIMARY KEY (id)
  );`;
}
