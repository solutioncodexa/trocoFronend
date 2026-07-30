import { useState, useEffect, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { topBarMessagesApi } from '@/services/api/topBarMessages';
import { TopBarMessageDTO } from '@/types/top-bar-messages';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';
import { useStoreAppearance } from '@/hooks/useStoreAppearance';

const defaultBarClass =
  'relative w-full max-w-full min-w-0 overflow-x-hidden border-b px-3 py-2.5 text-center text-xs font-medium tracking-wide sm:px-4 sm:text-sm';

function barStyle(bg?: string | null, fg?: string | null): {
  className: string;
  style?: CSSProperties;
} {
  const backgroundColor = bg?.trim() || undefined;
  const color = fg?.trim() || undefined;
  if (!backgroundColor && !color) {
    return {
      className: cn(
        defaultBarClass,
        'border-primary/20 bg-gradient-to-r from-primary via-primary to-sky text-primary-foreground',
      ),
    };
  }
  return {
    className: cn(defaultBarClass, 'border-black/10'),
    style: {
      backgroundColor: backgroundColor || 'hsl(var(--primary))',
      color: color || '#ffffff',
    },
  };
}

const TopBar = () => {
  const location = useLocation();
  const appearance = useStoreAppearance();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState<TopBarMessageDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await topBarMessagesApi.getActiveMessages(location.pathname);
        setMessages(fetchedMessages);
        setCurrentMessage(0);
        setLoading(false);
      } catch (error) {
        console.error('❌ TopBar: Erreur lors de la récupération des messages de la top bar:', error);
        setMessages([]);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchMessages();
  }, [location.pathname]);

  useEffect(() => {
    if (messages.length <= 1) return;

    let innerTimer: ReturnType<typeof setTimeout> | undefined;
    const rawSec = Number(messages[currentMessage]?.displayDurationSeconds);
    const seconds = Number.isFinite(rawSec) && rawSec > 0 ? rawSec : 7;
    const durationMs = Math.min(Math.max(seconds * 1000, 2000), 600_000);

    const outerTimer = setTimeout(() => {
      setIsVisible(false);
      innerTimer = setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 400);
    }, durationMs);

    return () => {
      clearTimeout(outerTimer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [currentMessage, messages]);

  // Priorité : messages Bandeau actifs (comme Apparence). Secours : bandeau fixe Apparence.
  if (!loading && messages.length > 0) {
    const active = messages[currentMessage];
    const look = barStyle(active?.backgroundColor, active?.textColor);
    return (
      <div className={look.className} style={look.style} role="status" aria-live="polite">
        {!active?.backgroundColor ? (
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 15% 50%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 85% 50%, rgba(255,255,255,0.2), transparent 40%)',
            }}
            aria-hidden
          />
        ) : null}
        <div className="relative flex min-h-[1.25rem] items-center justify-center px-1">
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
              ANIMATIONS.topBarTextPulse && messages.length <= 1 && 'animate-soft-pulse',
            )}
          >
            {active?.message}
          </div>
        </div>
      </div>
    );
  }

  if (appearance.headerPromoEnabled) {
    const text = appearance.headerPromoText?.trim();
    if (!text) return null;
    const look = barStyle(appearance.headerPromoBgColor, appearance.headerPromoTextColor);
    return (
      <div className={look.className} style={look.style} role="status" aria-live="polite">
        {text}
      </div>
    );
  }

  if (loading || messages.length === 0) {
    return null;
  }

  return null;
};

export default TopBar;
