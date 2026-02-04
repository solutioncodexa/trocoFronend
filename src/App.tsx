import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";

// Public pages
import Index from "./pages/Index";
import Boutique from "./pages/Boutique";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CustomOrder from "./pages/CustomOrder";
import Wishlist from "./pages/Wishlist";
import SurMesure from "./pages/SurMesure";
import Contact from "./pages/Contact";
import LivraisonRetours from "./pages/LivraisonRetours";
import FAQ from "./pages/FAQ";
import GuideTailles from "./pages/GuideTailles";
import CoursOr from "./pages/CoursOr";
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
import AdminGoldTypes from "./pages/admin/AdminGoldTypes";
import AdminFeaturedProducts from "./pages/admin/AdminFeaturedProducts";
import AdminTopBarMessages from "./pages/admin/AdminTopBarMessages";
import AdminPromoModals from "./pages/admin/AdminPromoModals";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/produit/:id" element={<ProductDetail />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/commande-personnalisee" element={<CustomOrder />} />
                <Route path="/sur-mesure" element={<SurMesure />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/livraison-retours" element={<LivraisonRetours />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/guide-tailles" element={<GuideTailles />} />
                <Route path="/prix-or-maroc" element={<CoursOr />} />
                <Route path="/favoris" element={<Wishlist />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                <Route path="/admin/produits" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
                <Route path="/admin/commandes" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
                <Route path="/admin/personnalisations" element={<ProtectedAdminRoute><AdminCustomRequests /></ProtectedAdminRoute>} />
                <Route path="/admin/collections" element={<ProtectedAdminRoute><AdminCollections /></ProtectedAdminRoute>} />
                <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminCategories /></ProtectedAdminRoute>} />
                <Route path="/admin/types" element={<ProtectedAdminRoute><AdminProductTypes /></ProtectedAdminRoute>} />
                <Route path="/admin/types-or" element={<ProtectedAdminRoute><AdminGoldTypes /></ProtectedAdminRoute>} />
                <Route path="/admin/produits-selectionnes" element={<ProtectedAdminRoute><AdminFeaturedProducts /></ProtectedAdminRoute>} />
                <Route path="/admin/top-bar-messages" element={<ProtectedAdminRoute><AdminTopBarMessages /></ProtectedAdminRoute>} />
                <Route path="/admin/promo-modals" element={<ProtectedAdminRoute><AdminPromoModals /></ProtectedAdminRoute>} />
                <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
                
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
