import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import PageLoader from "@/components/layout/PageLoader";
import { PERMISSIONS } from "@/config/permissions";

const Index = lazy(() => import("./pages/Index"));
const Boutique = lazy(() => import("./pages/Boutique"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const SurMesure = lazy(() => import("./pages/SurMesure"));
const Devis = lazy(() => import("./pages/Devis"));
const Contact = lazy(() => import("./pages/Contact"));
const LivraisonRetours = lazy(() => import("./pages/LivraisonRetours"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PromoCodes = lazy(() => import("./pages/PromoCodes"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomRequests = lazy(() => import("./pages/admin/AdminCustomRequests"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminHeroCategories = lazy(() => import("./pages/admin/AdminHeroCategories"));
const AdminFeaturedProducts = lazy(() => import("./pages/admin/AdminFeaturedProducts"));
const AdminTopBarMessages = lazy(() => import("./pages/admin/AdminTopBarMessages"));
const AdminPromoModals = lazy(() => import("./pages/admin/AdminPromoModals"));
const AdminPromoCodes = lazy(() => import("./pages/admin/AdminPromoCodes"));
const AdminStock = lazy(() => import("./pages/admin/AdminStock"));
const AdminRevenue = lazy(() => import("./pages/admin/AdminRevenue"));
const AdminSocialNetworks = lazy(() => import("./pages/admin/AdminSocialNetworks"));
const AdminMembers = lazy(() => import("./pages/admin/AdminMembers"));
const AdminAudit = lazy(() => import("./pages/admin/AdminAudit"));

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
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <ScrollToTop />
              <WhatsAppButton />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/boutique" element={<Boutique />} />
                  <Route path="/produit/:id" element={<ProductDetail />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/codes-promo" element={<PromoCodes />} />
                  <Route path="/sur-mesure" element={<SurMesure />} />
                  <Route path="/devis" element={<Devis />} />
                  <Route path="/commande-personnalisee" element={<Navigate to="/sur-mesure" replace />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/livraison-retours" element={<LivraisonRetours />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/favoris" element={<Wishlist />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                  <Route path="/admin/produits" element={<ProtectedAdminRoute permission={PERMISSIONS.PRODUCTS_VIEW}><AdminProducts /></ProtectedAdminRoute>} />
                  <Route path="/admin/commandes" element={<ProtectedAdminRoute permission={PERMISSIONS.ORDERS_VIEW}><AdminOrders /></ProtectedAdminRoute>} />
                  <Route path="/admin/personnalisations" element={<ProtectedAdminRoute permission={PERMISSIONS.CUSTOM_ORDERS_VIEW}><AdminCustomRequests /></ProtectedAdminRoute>} />
                  <Route path="/admin/categories" element={<ProtectedAdminRoute permission={PERMISSIONS.CATALOG_MANAGE}><AdminCategories /></ProtectedAdminRoute>} />
                  <Route path="/admin/accueil-categories" element={<ProtectedAdminRoute permission={PERMISSIONS.CATALOG_MANAGE}><AdminHeroCategories /></ProtectedAdminRoute>} />
                  <Route path="/admin/produits-selectionnes" element={<ProtectedAdminRoute permission={PERMISSIONS.CATALOG_MANAGE}><AdminFeaturedProducts /></ProtectedAdminRoute>} />
                  <Route path="/admin/top-bar-messages" element={<ProtectedAdminRoute permission={PERMISSIONS.CONTENT_MANAGE}><AdminTopBarMessages /></ProtectedAdminRoute>} />
                  <Route path="/admin/promo-modals" element={<ProtectedAdminRoute permission={PERMISSIONS.CONTENT_MANAGE}><AdminPromoModals /></ProtectedAdminRoute>} />
                  <Route path="/admin/codes-promo" element={<ProtectedAdminRoute permission={PERMISSIONS.CONTENT_MANAGE}><AdminPromoCodes /></ProtectedAdminRoute>} />
                  <Route path="/admin/stock" element={<ProtectedAdminRoute permission={PERMISSIONS.STOCK_VIEW}><AdminStock /></ProtectedAdminRoute>} />
                  <Route path="/admin/revenus" element={<ProtectedAdminRoute permission={PERMISSIONS.STATS_VIEW}><AdminRevenue /></ProtectedAdminRoute>} />
                  <Route path="/admin/reseaux-sociaux" element={<ProtectedAdminRoute permission={PERMISSIONS.CONTENT_MANAGE}><AdminSocialNetworks /></ProtectedAdminRoute>} />
                  <Route path="/admin/membres" element={<ProtectedAdminRoute adminOnly><AdminMembers /></ProtectedAdminRoute>} />
                  <Route path="/admin/audit" element={<ProtectedAdminRoute permission={PERMISSIONS.AUDIT_VIEW}><AdminAudit /></ProtectedAdminRoute>} />
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
