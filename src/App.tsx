import { lazy, Suspense } from "react";
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
import PageLoader from "@/components/layout/PageLoader";

const Index = lazy(() => import("./pages/Index"));
const Boutique = lazy(() => import("./pages/Boutique"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CustomOrder = lazy(() => import("./pages/CustomOrder"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const SurMesure = lazy(() => import("./pages/SurMesure"));
const Contact = lazy(() => import("./pages/Contact"));
const LivraisonRetours = lazy(() => import("./pages/LivraisonRetours"));
const FAQ = lazy(() => import("./pages/FAQ"));
const GuideTailles = lazy(() => import("./pages/GuideTailles"));
const CoursOr = lazy(() => import("./pages/CoursOr"));
const MaMaison = lazy(() => import("./pages/MaMaison"));
const NosAteliers = lazy(() => import("./pages/NosAteliers"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomRequests = lazy(() => import("./pages/admin/AdminCustomRequests"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminProductTypes = lazy(() => import("./pages/admin/AdminProductTypes"));
const AdminCollections = lazy(() => import("./pages/admin/AdminCollections"));
const AdminGoldTypes = lazy(() => import("./pages/admin/AdminGoldTypes"));
const AdminFeaturedProducts = lazy(() => import("./pages/admin/AdminFeaturedProducts"));
const AdminTopBarMessages = lazy(() => import("./pages/admin/AdminTopBarMessages"));
const AdminPromoModals = lazy(() => import("./pages/admin/AdminPromoModals"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
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
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
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
                  <Route path="/ma-maison" element={<MaMaison />} />
                  <Route path="/nos-ateliers" element={<NosAteliers />} />
                  <Route path="/favoris" element={<Wishlist />} />
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
