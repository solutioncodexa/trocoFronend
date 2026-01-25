import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-display text-6xl md:text-8xl text-primary mb-4">404</h1>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            Page non trouvée
          </h2>
          <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button asChild size="lg" className="font-body uppercase tracking-wider">
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
