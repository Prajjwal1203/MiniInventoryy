
export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  reorderLevel: number;
  supplierId: number;
  createdAt: Date;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

export interface Transaction {
  id: number;
  productId: number;
  type: 'sale' | 'purchase';
  quantity: number;
  amount: number;
  date: Date;
  notes: string;
}

export interface InventoryContextType {
  products: Product[];
  suppliers: Supplier[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: number, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  getLowStockProducts: () => Product[];
  getSupplierById: (id: number) => Supplier | undefined;
  getProductById: (id: number) => Product | undefined;
}
