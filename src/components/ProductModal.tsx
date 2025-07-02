
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/context/InventoryContext';
import { Product, Supplier } from '@/types/inventory';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  suppliers: Supplier[];
}

export const ProductModal = ({ isOpen, onClose, product, suppliers }: ProductModalProps) => {
  const { addProduct, updateProduct } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    reorderLevel: '',
    supplierId: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity.toString(),
        price: product.price.toString(),
        reorderLevel: product.reorderLevel.toString(),
        supplierId: product.supplierId.toString(),
      });
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: '',
        price: '',
        reorderLevel: '',
        supplierId: '',
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      reorderLevel: parseInt(formData.reorderLevel),
      supplierId: parseInt(formData.supplierId),
    };

    if (product) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="Enter category"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.00"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reorderLevel">Reorder Level</Label>
            <Input
              id="reorderLevel"
              type="number"
              value={formData.reorderLevel}
              onChange={(e) => handleChange('reorderLevel', e.target.value)}
              placeholder="Enter minimum stock level"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select 
              value={formData.supplierId} 
              onValueChange={(value) => handleChange('supplierId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {product ? 'Update' : 'Add'} Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
