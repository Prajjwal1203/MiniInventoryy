
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Package, Brain } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { ProductModal } from '@/components/ProductModal';
import { ReorderSuggestions } from '@/components/ReorderSuggestions';
import { Product } from '@/types/inventory';

const Products = () => {
  const { products, suppliers, deleteProduct, getSupplierById } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForAI, setSelectedProductForAI] = useState<Product | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleAISuggestion = (product: Product) => {
    setSelectedProductForAI(product);
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const };
    } else if (product.quantity <= product.reorderLevel) {
      return { label: 'Low Stock', variant: 'secondary' as const };
    } else {
      return { label: 'In Stock', variant: 'default' as const };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory items with AI-powered reorder suggestions
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Products Grid - Left 2/3 */}
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProducts.map((product) => {
              const supplier = getSupplierById(product.supplierId);
              const stockStatus = getStockStatus(product);
              
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <Badge variant={stockStatus.variant} className="text-xs">
                        {stockStatus.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <p className="font-medium">${product.price}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <p className="font-medium">{product.quantity}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reorder Level:</span>
                        <p className="font-medium">{product.reorderLevel}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Supplier:</span>
                        <p className="font-medium text-xs">{supplier?.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="flex-1 gap-2"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAISuggestion(product)}
                        className="flex-1 gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <Brain className="h-3 w-3" />
                        AI Suggest
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
                </p>
                {!searchTerm && (
                  <Button onClick={handleAdd} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Suggestions Panel - Right 1/3 */}
        <div className="lg:col-span-1">
          {selectedProductForAI ? (
            <div className="sticky top-6">
              <ReorderSuggestions
                productId={selectedProductForAI.id}
                productName={selectedProductForAI.name}
                currentStock={selectedProductForAI.quantity}
              />
            </div>
          ) : (
            <Card className="sticky top-6">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">AI Reorder Assistant</h3>
                <p className="text-muted-foreground text-center text-sm">
                  Click the "AI Suggest" button on any product to get intelligent reorder recommendations powered by Gemini AI.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        suppliers={suppliers}
      />
    </div>
  );
};

export default Products;
