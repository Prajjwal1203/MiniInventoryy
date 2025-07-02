
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Package, Users } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { SupplierModal } from '@/components/SupplierModal';
import { Supplier } from '@/types/inventory';

const Suppliers = () => {
  const { suppliers, products, deleteSupplier } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const relatedProducts = products.filter(p => p.supplierId === id);
    if (relatedProducts.length > 0) {
      alert(`Cannot delete supplier. ${relatedProducts.length} products are associated with this supplier.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      deleteSupplier(id);
    }
  };

  const getSupplierProductCount = (supplierId: number) => {
    return products.filter(p => p.supplierId === supplierId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your supplier relationships
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

    
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => {
          const productCount = getSupplierProductCount(supplier.id);
          
          return (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{supplier.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Package className="h-3 w-3" />
                  {productCount} products
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Contact:</span>
                    <p className="font-medium">{supplier.contact}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{supplier.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{supplier.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p className="font-medium text-xs leading-relaxed">{supplier.address}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(supplier)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(supplier.id)}
                    className="flex-1 gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    disabled={productCount > 0}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first supplier'}
            </p>
            {!searchTerm && (
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Supplier
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={editingSupplier}
      />
    </div>
  );
};

export default Suppliers;
