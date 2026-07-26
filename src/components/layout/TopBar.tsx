import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { topBarMessagesApi } from '@/services/api/topBarMessages';
import { TopBarMessageDTO } from '@/types/top-bar-messages';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';

const TopBar = () => {
  const location = useLocation();
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

  if (loading || messages.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full max-w-full min-w-0 overflow-x-hidden border-b border-primary/20 bg-gradient-to-r from-primary via-primary to-sky px-3 py-2.5 text-center text-xs font-medium tracking-wide text-primary-foreground sm:px-4 sm:text-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 50%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 85% 50%, rgba(255,255,255,0.2), transparent 40%)',
        }}
        aria-hidden
      />
      <div className="relative flex min-h-[1.25rem] items-center justify-center px-1">
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
            ANIMATIONS.topBarTextPulse && messages.length <= 1 && 'animate-soft-pulse',
          )}
        >
          {messages[currentMessage]?.message}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
