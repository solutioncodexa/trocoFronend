import { useState, useEffect } from 'react';

const TopBar = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const messages = [
    "Livraison offerte dès 2000 DH d'achat",
    "Retours gratuits sous 30 jours"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 400);
    }, 7000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-royal-bordeaux text-ivory-text py-2 text-center text-sm font-medium tracking-wide">
      <div className="relative h-5 flex items-center justify-center">
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          {messages[currentMessage]}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
