import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import PageLoader from "@/components/layout/PageLoader";
import { PERMISSIONS } from "@/config/permissions";

const HomeRoute = lazy(() => import("./pages/HomeRoute"));
const Index = lazy(() => import("./pages/Index"));
const MatjaronaHome = lazy(() => import("./pages/MatjaronaHome"));
const CreateStore = lazy(() => import("./pages/CreateStore"));
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
const AdminStoreSettings = lazy(() => import("./pages/admin/AdminStoreSettings"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminPageEditor = lazy(() => import("./pages/admin/AdminPageEditor"));
const AdminGlobalSections = lazy(() => import("./pages/admin/AdminGlobalSections"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminAbandonedCarts = lazy(() => import("./pages/admin/AdminAbandonedCarts"));
const AdminWebhooks = lazy(() => import("./pages/admin/AdminWebhooks"));
const AdminPrivacy = lazy(() => import("./pages/admin/AdminPrivacy"));
const AdminApiKeys = lazy(() => import("./pages/admin/AdminApiKeys"));
const AdminShipping = lazy(() => import("./pages/admin/AdminShipping"));
const AdminOnboarding = lazy(() => import("./pages/admin/AdminOnboarding"));
const AdminOnlineStore = lazy(() => import("./pages/admin/AdminOnlineStore"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CustomStorePage = lazy(() => import("./pages/CustomStorePage"));
const PagePreview = lazy(() => import("./pages/PagePreview"));
const DesignDemo = lazy(() => import("./pages/DesignDemo"));
const DemoHomePage = lazy(() =>
  import("./pages/demo/DemoPages").then((m) => ({ default: m.DemoHomePage })),
);
const DemoBoutiquePage = lazy(() =>
  import("./pages/demo/DemoPages").then((m) => ({ default: m.DemoBoutiquePage })),
);
const DemoProductPage = lazy(() =>
  import("./pages/demo/DemoPages").then((m) => ({ default: m.DemoProductPage })),
);
const DemoCartPage = lazy(() =>
  import("./pages/demo/DemoPages").then((m) => ({ default: m.DemoCartPage })),
);
const DemoContactPage = lazy(() =>
  import("./pages/demo/DemoPages").then((m) => ({ default: m.DemoContactPage })),
);
const DemoSurMesurePage = lazy(() =>
  import("./pages/demo/DemoPages").then((m) => ({ default: m.DemoSurMesurePage })),
);
const DemoFaqPage = lazy(() =>
  import("./pages/demo/DemoPages").then((m) => ({ default: m.DemoFaqPage })),
);
const DemoLivraisonPage = lazy(() =>
  import("./pages/demo/DemoPages").then((m) => ({ default: m.DemoLivraisonPage })),
);
const DemoWishlistPage = lazy(() =>
  import("./pages/demo/DemoPages").then((m) => ({ default: m.DemoWishlistPage })),
);

const SuperAdminLogin = lazy(() => import("./pages/superadmin/SuperAdminLogin"));
const SuperAdminDashboard = lazy(() => import("./pages/superadmin/SuperAdminDashboard"));
const SuperAdminFournisseurs = lazy(() => import("./pages/superadmin/SuperAdminFournisseurs"));
const SuperAdminPlans = lazy(() => import("./pages/superadmin/SuperAdminPlans"));

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
      <TenantProvider>
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
                <LocaleProvider>
                <ScrollToTop />
                <WhatsAppButton />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomeRoute />} />
                    <Route path="/accueil" element={<Index />} />
                    <Route path="/matjarona" element={<MatjaronaHome />} />
                    <Route path="/creer-boutique" element={<CreateStore />} />
                    <Route path="/design-demo/:themeKey" element={<DesignDemo />}>
                      <Route index element={<DemoHomePage />} />
                      <Route path="boutique" element={<DemoBoutiquePage />} />
                      <Route path="produit/:id" element={<DemoProductPage />} />
                      <Route path="panier" element={<DemoCartPage />} />
                      <Route path="favoris" element={<DemoWishlistPage />} />
                      <Route path="sur-mesure" element={<DemoSurMesurePage />} />
                      <Route path="devis" element={<DemoSurMesurePage />} />
                      <Route path="contact" element={<DemoContactPage />} />
                      <Route path="faq" element={<DemoFaqPage />} />
                      <Route path="livraison-retours" element={<DemoLivraisonPage />} />
                      <Route path="codes-promo" element={<DemoFaqPage />} />
                    </Route>
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
                    <Route path="/page/:slug" element={<CustomStorePage />} />
                    <Route path="/preview/:token" element={<PagePreview />} />
                    <Route path="/blog" element={<BlogList />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />

                    <Route path="/super-admin" element={<SuperAdminLogin />} />
                    <Route
                      path="/super-admin/dashboard"
                      element={
                        <ProtectedAdminRoute superAdminOnly>
                          <SuperAdminDashboard />
                        </ProtectedAdminRoute>
                      }
                    />
                    <Route
                      path="/super-admin/fournisseurs"
                      element={
                        <ProtectedAdminRoute superAdminOnly>
                          <SuperAdminFournisseurs />
                        </ProtectedAdminRoute>
                      }
                    />
                    <Route
                      path="/super-admin/packs"
                      element={
                        <ProtectedAdminRoute superAdminOnly>
                          <SuperAdminPlans />
                        </ProtectedAdminRoute>
                      }
                    />

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
                    <Route path="/admin/parametres" element={<ProtectedAdminRoute adminOnly><AdminStoreSettings /></ProtectedAdminRoute>} />
                    <Route path="/admin/reglages" element={<ProtectedAdminRoute adminOnly><AdminStoreSettings /></ProtectedAdminRoute>} />
                    <Route path="/admin/boutique-en-ligne" element={<ProtectedAdminRoute><AdminOnlineStore /></ProtectedAdminRoute>} />
                    <Route path="/admin/onboarding" element={<ProtectedAdminRoute adminOnly><AdminOnboarding /></ProtectedAdminRoute>} />
                    <Route path="/admin/pages" element={<ProtectedAdminRoute><AdminPages /></ProtectedAdminRoute>} />
                    <Route path="/admin/pages/:id" element={<ProtectedAdminRoute><AdminPageEditor /></ProtectedAdminRoute>} />
                    <Route path="/admin/sections" element={<ProtectedAdminRoute><AdminGlobalSections /></ProtectedAdminRoute>} />
                    <Route path="/admin/leads" element={<ProtectedAdminRoute><AdminLeads /></ProtectedAdminRoute>} />
                    <Route path="/admin/blog" element={<ProtectedAdminRoute><AdminBlog /></ProtectedAdminRoute>} />
                    <Route path="/admin/avis" element={<ProtectedAdminRoute permission={PERMISSIONS.CONTENT_MANAGE}><AdminReviews /></ProtectedAdminRoute>} />
                    <Route path="/admin/paniers-abandonnes" element={<ProtectedAdminRoute permission={PERMISSIONS.ORDERS_VIEW}><AdminAbandonedCarts /></ProtectedAdminRoute>} />
                    <Route path="/admin/webhooks" element={<ProtectedAdminRoute permission={PERMISSIONS.WEBHOOKS_MANAGE}><AdminWebhooks /></ProtectedAdminRoute>} />
                    <Route path="/admin/conformite" element={<ProtectedAdminRoute permission={PERMISSIONS.PRIVACY_MANAGE}><AdminPrivacy /></ProtectedAdminRoute>} />
                    <Route path="/admin/api-keys" element={<ProtectedAdminRoute permission={PERMISSIONS.API_KEYS_MANAGE}><AdminApiKeys /></ProtectedAdminRoute>} />
                    <Route path="/admin/livraison" element={<ProtectedAdminRoute permission={PERMISSIONS.ORDERS_VIEW}><AdminShipping /></ProtectedAdminRoute>} />
                    <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                </LocaleProvider>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AdminProvider>
      </TenantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
