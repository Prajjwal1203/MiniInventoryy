
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInventory } from '@/context/InventoryContext';
import { Supplier } from '@/types/inventory';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export const SupplierModal = ({ isOpen, onClose, supplier }: SupplierModalProps) => {
  const { addSupplier, updateSupplier } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      });
    } else {
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [supplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (supplier) {
      updateSupplier(supplier.id, formData);
    } else {
      addSupplier(formData);
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
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Person</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              placeholder="Enter contact person name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter full address"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {supplier ? 'Update' : 'Add'} Supplier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
