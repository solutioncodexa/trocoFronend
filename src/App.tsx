import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

// Public pages
import Index from "./pages/Index";
import Boutique from "./pages/Boutique";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CustomOrder from "./pages/CustomOrder";
import Wishlist from "./pages/Wishlist";
import SurMesure from "./pages/SurMesure";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomRequests from "./pages/admin/AdminCustomRequests";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProductTypes from "./pages/admin/AdminProductTypes";
import AdminCollections from "./pages/admin/AdminCollections";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/produit/:id" element={<ProductDetail />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/commande-personnalisee" element={<CustomOrder />} />
                <Route path="/sur-mesure" element={<SurMesure />} />
                <Route path="/favoris" element={<Wishlist />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/produits" element={<AdminProducts />} />
                <Route path="/admin/commandes" element={<AdminOrders />} />
                <Route path="/admin/personnalisations" element={<AdminCustomRequests />} />
                <Route path="/admin/collections" element={<AdminCollections />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/types" element={<AdminProductTypes />} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
