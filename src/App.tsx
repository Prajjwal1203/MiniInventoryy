
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventoryProvider } from "@/context/InventoryContext";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <InventoryProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
              <AppSidebar />
              <main className="flex-1 p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </InventoryProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
