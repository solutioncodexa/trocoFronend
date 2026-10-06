import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Client } from '@stomp/stompjs';
import { getStoredToken } from '@/services/api/auth';
import { buildWsUrl } from '@/hooks/useAdminNotificationSocket';

const REFRESH_DEBOUNCE_MS = 400;

/**
 * Revenus en direct : le backend pousse un signal `REVENUE_CHANGED` (sans montant) sur
 * `/topic/store.{fournisseurId}.revenue` à chaque commande créée / changée de statut / supprimée.
 * On invalide alors les requêtes `['stats']` — les chiffres se mettent à jour sans recharger la page.
 * Si le socket est coupé, on retombe sur un rafraîchissement périodique (le client STOMP se reconnecte seul).
 */
export function useRevenueSocket(fournisseurId?: number | null) {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const [lastEventAt, setLastEventAt] = useState<Date | null>(null);
  const qcRef = useRef(queryClient);
  qcRef.current = queryClient;

  useEffect(() => {
    if (fournisseurId == null || fournisseurId <= 0) return;
    const initialToken = getStoredToken();
    if (!initialToken) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void qcRef.current.invalidateQueries({ queryKey: ['stats'] });
        setLastEventAt(new Date());
      }, REFRESH_DEBOUNCE_MS);
    };

    const client = new Client({
      brokerURL: buildWsUrl(initialToken),
      connectHeaders: { Authorization: `Bearer ${initialToken}`, access_token: initialToken },
      reconnectDelay: 4000,
      heartbeatIncoming: 15000,
      heartbeatOutgoing: 15000,
      beforeConnect: () => {
        const t = getStoredToken();
        if (!t) return;
        client.brokerURL = buildWsUrl(t);
        client.connectHeaders = { Authorization: `Bearer ${t}`, access_token: t };
      },
      onConnect: () => {
        setConnected(true);
        // Resynchronise : des événements ont pu être manqués pendant une coupure.
        refresh();
        client.subscribe(`/topic/store.${fournisseurId}.revenue`, refresh);
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
      onStompError: () => setConnected(false),
    });
    client.activate();

    return () => {
      if (timer) clearTimeout(timer);
      void client.deactivate();
      setConnected(false);
    };
  }, [fournisseurId]);

  return { connected, lastEventAt };
}
