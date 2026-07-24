import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';
import { markStockAlertPending } from '@/utils/stockAlertSession';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email.trim(), password);
    if (result.ok) {
      markStockAlertPending();
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Email ou mot de passe incorrect');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background surface-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <BrandLogoImg className="h-[4.5rem] sm:h-24 md:h-28 w-auto mx-auto mb-3 max-w-[min(100%,320px)]" draggable={false} />
          <p className="text-muted-foreground text-sm uppercase tracking-widest">
            Administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl text-foreground">Connexion Admin</h2>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Accédez au tableau de bord
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-body text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="font-body">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="font-body">Mot de passe</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-body uppercase tracking-wider"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
