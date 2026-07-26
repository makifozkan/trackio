export const DATA_CLASS_PRESETS = {
  blank: {
    name: 'NewType',
    attributes: ['id: string'],
  },
  user: {
    name: 'User',
    attributes: [
      'id: string',
      'email: string',
      'firstName: string',
      'lastName: string',
      'role: "admin" | "user"',
      'isActive: boolean',
      'createdAt: string',
    ],
  },
  product: {
    name: 'Product',
    attributes: [
      'id: string',
      'sku: string',
      'name: string',
      'price: number',
      'stock: number',
      'isActive: boolean',
    ],
  },
  invoice: {
    name: 'Invoice',
    attributes: [
      'id: string',
      'customerId: string',
      'amount: number',
      'status: "paid" | "pending" | "void"',
      'dueDate: string',
    ],
  },
};

export const DB_TABLE_PRESETS = {
  users: {
    tableName: 'user',
    columns: [
      { name: 'id', type: 'SERIAL', isPK: true },
      { name: 'name', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'image', type: 'TEXT' },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
    ],
  },
  sessions: {
    tableName: 'session',
    columns: [
      { name: 'id', type: 'UUID', isPK: true },
      { name: 'user_id', type: 'UUID', isFK: true },
      { name: 'session_token', type: 'TEXT' },
      { name: 'expires', type: 'TIMESTAMPTZ' },
    ],
  },
  products: {
    tableName: 'product',
    columns: [
      { name: 'id', type: 'SERIAL', isPK: true },
      { name: 'sku', type: 'VARCHAR(255)' },
      { name: 'name', type: 'VARCHAR(255)' },
      { name: 'price', type: 'DECIMAL' },
      { name: 'stock', type: 'INT' },
    ],
  },
  invoices: {
    tableName: 'invoice',
    columns: [
      { name: 'id', type: 'SERIAL', isPK: true },
      { name: 'customer_id', type: 'INT', isFK: true },
      { name: 'amount', type: 'DECIMAL' },
      { name: 'status', type: 'VARCHAR(255)' },
      { name: 'due_date', type: 'DATE' },
    ],
  },
  users_v2: {
    tableName: 'user_v2',
    columns: [
      { name: 'id', type: 'UUID', isPK: true, defaultValue: 'uuid_generate_v4()' },
      { name: 'name', type: 'VARCHAR(255)', isNotNull: true },
      { name: 'email', type: 'VARCHAR(255)', isNotNull: true },
      { name: 'image', type: 'TEXT' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNotNull: true, defaultValue: 'now()' },
    ],
  },
};
