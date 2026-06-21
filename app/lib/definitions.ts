// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  categories: string[]; // Fixed to plural
  keywords: string[];
  status: 'High Potential' | 'Active Test' | 'Paused' | 'High Alpha' | 'Draft';
  is_ai_generated: boolean;
  created_at: string;
};

export type Project = {
  id: string;
  name: string;
  source_idea_id: string;
  source_idea?: Idea;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  start_date: string;
  end_date: string;
  team_members?: User[];
  tasks?: Partial<Task>[];
  created_at: string;
};

export type Task = {
  id: string;
  order: number; // New field to track the order of tasks
  name: string;
  category: string;
  duration: number; // Duration in days
  description: string;
  project_id: string;
  project?: Project;
  status: 'Pending' | 'In Progress' | 'Completed';
  start_date: string;
  end_date: string;
  is_leaf_node: boolean;
  parent_task_id?: string;
  parent_task?: Task;
  priority: 'Low' | 'Medium' | 'High';
  sub_tasks?: Partial<Task>[];
  is_expanded?: boolean; // For UI state management
  created_at: string;
};
