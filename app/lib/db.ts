import postgres from 'postgres';

// Initialize the postgres connection pool once
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export { sql };
