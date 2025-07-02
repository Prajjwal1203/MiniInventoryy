
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, ShoppingCart, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { TransactionModal } from '@/components/TransactionModal';

const Transactions = () => {
  const { transactions, products, getProductById } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = transactions
    .filter(transaction => {
      const product = getProductById(transaction.productId);
      const matchesSearch = product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const getTransactionIcon = (type: string) => {
    return type === 'sale' ? (
      <ShoppingCart className="h-4 w-4 text-green-600" />
    ) : (
      <Package className="h-4 w-4 text-blue-600" />
    );
  };

  const getTransactionBadge = (type: string) => {
    return type === 'sale' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Sale
      </Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        Purchase
      </Badge>
    );
  };


  const totalSales = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPurchases = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalSales - totalPurchases;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Track your sales and purchases
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              Revenue from sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalPurchases)}</div>
            <p className="text-xs text-muted-foreground">
              Cost of purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sales minus purchases
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All
          </Button>
          <Button
            variant={filterType === 'sale' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('sale')}
          >
            Sales
          </Button>
          <Button
            variant={filterType === 'purchase' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('purchase')}
          >
            Purchases
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.map((transaction) => {
          const product = getProductById(transaction.productId);
          
          return (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <h3 className="font-medium">{product?.name || 'Unknown Product'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {transaction.type === 'sale' ? 'Sold' : 'Purchased'} {transaction.quantity} units
                      </p>
                      {transaction.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {transaction.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-right">
                    <div>
                      <p className="font-bold text-lg">{formatCurrency(transaction.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                    {getTransactionBadge(transaction.type)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No transactions found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by recording your first transaction'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
      />
    </div>
  );
};

export default Transactions;
