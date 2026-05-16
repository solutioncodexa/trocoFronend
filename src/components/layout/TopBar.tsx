import { useState, useEffect } from 'react';
import { topBarMessagesApi } from '@/services/api/topBarMessages';
import { TopBarMessageDTO } from '@/types/top-bar-messages';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';

const TopBar = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState<TopBarMessageDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await topBarMessagesApi.getActiveMessages();
        setMessages(fetchedMessages);
        setLoading(false);
      } catch (error) {
        console.error('❌ TopBar: Erreur lors de la récupération des messages de la top bar:', error);
        // Ne pas afficher de messages par défaut - seulement les messages de la base de données
        setMessages([]);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

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

  if (loading) {
    return null; // Ne rien afficher pendant le chargement
  }

  if (messages.length === 0) {
    return null; // Ne pas afficher la top bar s'il n'y a pas de messages
  }

  return (
    <div className="bg-royal-bordeaux text-ivory-text py-2 px-3 sm:px-4 text-center text-xs sm:text-sm font-medium tracking-wide w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="relative min-h-[1.25rem] flex items-center justify-center px-1">
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
            ANIMATIONS.topBarTextPulse && messages.length <= 1 && 'animate-soft-pulse'
          )}
        >
          {messages[currentMessage]?.message}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
