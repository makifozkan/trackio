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
