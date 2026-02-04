import { useState, useEffect } from 'react';
import { topBarMessagesApi } from '@/services/api/topBarMessages';
import { TopBarMessageDTO } from '@/types/top-bar-messages';

const TopBar = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState<TopBarMessageDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('🔍 TopBar: Récupération des messages...');
        const fetchedMessages = await topBarMessagesApi.getActiveMessages();
        console.log('✅ TopBar: Messages reçus:', fetchedMessages);
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

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 400);
    }, 7000); 

    return () => clearInterval(interval);
  }, [messages.length]);

  if (loading) {
    return null; // Ne rien afficher pendant le chargement
  }

  if (messages.length === 0) {
    return null; // Ne pas afficher la top bar s'il n'y a pas de messages
  }

  return (
    <div className="bg-royal-bordeaux text-ivory-text py-2 text-center text-sm font-medium tracking-wide">
      <div className="relative h-5 flex items-center justify-center">
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          {messages[currentMessage]?.message}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
