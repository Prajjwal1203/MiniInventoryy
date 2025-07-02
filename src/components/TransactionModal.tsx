
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/context/InventoryContext';
import { Product } from '@/types/inventory';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const TransactionModal = ({ isOpen, onClose, products }: TransactionModalProps) => {
  const { addTransaction } = useInventory();
  const [formData, setFormData] = useState({
    productId: '',
    type: '',
    quantity: '',
    amount: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      productId: parseInt(formData.productId),
      type: formData.type as 'sale' | 'purchase',
      quantity: parseInt(formData.quantity),
      amount: parseFloat(formData.amount),
      notes: formData.notes,
    };

    addTransaction(transactionData);
    
    // Reset form
    setFormData({
      productId: '',
      type: '',
      quantity: '',
      amount: '',
      notes: '',
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
  const suggestedAmount = selectedProduct && formData.quantity 
    ? (selectedProduct.price * parseInt(formData.quantity)).toFixed(2)
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Product</Label>
            <Select 
              value={formData.productId} 
              onValueChange={(value) => handleChange('productId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name} (${product.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="Enter quantity"
              min="1"
              required
            />
            {selectedProduct && formData.type === 'sale' && (
              <p className="text-xs text-muted-foreground">
                Available stock: {selectedProduct.quantity}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder={suggestedAmount ? `Suggested: ${suggestedAmount}` : "Enter amount"}
              min="0"
              required
            />
            {suggestedAmount && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleChange('amount', suggestedAmount)}
                className="text-xs"
              >
                Use Suggested: ${suggestedAmount}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
