
import React, { createContext, useContext, useState } from 'react';
import { Product, Supplier, Transaction, InventoryContextType } from '@/types/inventory';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      quantity: 25,
      price: 99.99,
      reorderLevel: 10,
      supplierId: 1,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Coffee Beans - Premium',
      category: 'Food & Beverage',
      quantity: 5,
      price: 24.99,
      reorderLevel: 15,
      supplierId: 2,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: 3,
      name: 'Office Chair',
      category: 'Furniture',
      quantity: 12,
      price: 249.99,
      reorderLevel: 5,
      supplierId: 1,
      createdAt: new Date('2024-01-25'),
    },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      contact: 'John Smith',
      email: 'john@techsolutions.com',
      phone: '+1-555-0123',
      address: '123 Tech Street, Silicon Valley, CA',
    },
    {
      id: 2,
      name: 'Global Supplies Co.',
      contact: 'Sarah Johnson',
      email: 'sarah@globalsupplies.com',
      phone: '+1-555-0456',
      address: '456 Supply Ave, New York, NY',
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      productId: 1,
      type: 'sale',
      quantity: 3,
      amount: 299.97,
      date: new Date('2024-06-25'),
      notes: 'Walk-in customer purchase',
    },
    {
      id: 2,
      productId: 2,
      type: 'purchase',
      quantity: 20,
      amount: 499.80,
      date: new Date('2024-06-24'),
      notes: 'Weekly inventory restock',
    },
    {
      id: 3,
      productId: 3,
      type: 'sale',
      quantity: 1,
      amount: 249.99,
      date: new Date('2024-06-23'),
      notes: 'Online order fulfillment',
    },
  ]);

  // Helper functions
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      createdAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now(),
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: number, updatedSupplier: Partial<Supplier>) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === id ? { ...supplier, ...updatedSupplier } : supplier
      )
    );
  };

  const deleteSupplier = (id: number) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      date: new Date(),
    };
    setTransactions(prev => [...prev, newTransaction]);

    // Update product quantity based on transaction type
    if (transaction.type === 'sale') {
      const product = products.find(p => p.id === transaction.productId);
      if (product) {
        updateProduct(transaction.productId, {
          quantity: product.quantity - transaction.quantity
        });
      }
    } else if (transaction.type === 'purchase') {
      const product = products.find(p => p.id === transaction.productId);
      if (product) {
        updateProduct(transaction.productId, {
          quantity: product.quantity + transaction.quantity
        });
      }
    }
  };

  const getLowStockProducts = (): Product[] => {
    return products.filter(product => product.quantity <= product.reorderLevel);
  };

  const getSupplierById = (id: number): Supplier | undefined => {
    return suppliers.find(supplier => supplier.id === id);
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const value: InventoryContextType = {
    products,
    suppliers,
    transactions,
    addProduct,
    updateProduct,
    deleteProduct,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addTransaction,
    getLowStockProducts,
    getSupplierById,
    getProductById,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
