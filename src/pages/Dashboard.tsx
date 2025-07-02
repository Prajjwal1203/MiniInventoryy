
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Users, TrendingUp, AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';

const Dashboard = () => {
  const { products, suppliers, transactions, getLowStockProducts } = useInventory();
  
  const lowStockProducts = getLowStockProducts();
  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;
  const recentTransactions = transactions.slice(-5).reverse();
  
  const totalRevenue = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalPurchases = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your inventory management system
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active inventory items
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Active suppliers
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Total sales revenue
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Need reordering
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>{lowStockProducts.length} products</strong> are running low on stock and need reordering.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
       
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              Products that need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                All products are well stocked! 🎉
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Current: {product.quantity} | Reorder at: {product.reorderLevel}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Low Stock
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Latest 5 transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const product = products.find(p => p.id === transaction.productId);
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {transaction.type === 'sale' ? (
                        <ShoppingCart className="h-4 w-4 text-green-500" />
                      ) : (
                        <Package className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <h4 className="font-medium">{product?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {transaction.type === 'sale' ? 'Sold' : 'Purchased'} {transaction.quantity} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
