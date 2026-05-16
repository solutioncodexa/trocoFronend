import { ReactNode, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import TopBar from './TopBar';
import PromoModal from '../ui/PromoModal';
import { ANIMATIONS } from '@/config/animations';
import { useProtectSiteImages } from '@/hooks/useProtectSiteImages';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const pageFade = ANIMATIONS.pageFadeOnRouteChange;
  const shellRef = useRef<HTMLDivElement>(null);
  const siteContentRef = useRef<HTMLDivElement>(null);
  useProtectSiteImages(siteContentRef);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const setOffset = () => {
      document.documentElement.style.setProperty('--layout-top-offset', `${el.offsetHeight}px`);
    };
    setOffset();

    const ro = new ResizeObserver(setOffset);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--layout-top-offset');
    };
  }, []);

  return (
    <div
      ref={siteContentRef}
      className="site-protected-media flex flex-col min-h-screen w-full min-w-0 max-w-full overflow-x-hidden"
    >
      <div
        ref={shellRef}
        className="fixed inset-x-0 top-0 z-50 flex flex-col supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]"
      >
        <TopBar />
        <Header />
      </div>
      <main
        className="flex-grow min-w-0 w-full overflow-x-hidden"
        style={{ paddingTop: 'var(--layout-top-offset, 4rem)' }}
      >
        {pageFade ? (
          <div key={pathname} className="animate-fade-in motion-reduce:animate-none" style={{ animationDuration: '0.35s' }}>
            {children}
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
      <PromoModal />
    </div>
  );
};

export default Layout;
