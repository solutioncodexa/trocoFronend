import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Client } from '@stomp/stompjs';
import { API_BASE_URL } from '@/config/api';
import { getStoredToken } from '@/services/api/auth';
import type { NotificationDTO } from '@/types/api';

function buildWsUrl(token: string): string {
  const base = API_BASE_URL || '/api';
  if (base.startsWith('http://') || base.startsWith('https://')) {
    const u = new URL(base);
    u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
    u.pathname = `${u.pathname.replace(/\/$/, '')}/ws`;
    u.search = `access_token=${encodeURIComponent(token)}`;
    return u.toString();
  }
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const path = `${base.replace(/\/$/, '')}/ws`;
  return `${proto}//${window.location.host}${path}?access_token=${encodeURIComponent(token)}`;
}

/**
 * STOMP admin (pattern MizanePro) — topic `/topic/store.{fournisseurId}`.
 * Invalide React Query à chaque push ; badge mis à jour sans poll 30s.
 */
export function useAdminNotificationSocket(fournisseurId?: number | null) {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const qcRef = useRef(queryClient);
  qcRef.current = queryClient;

  useEffect(() => {
    if (fournisseurId == null || fournisseurId <= 0) {
      setConnected(false);
      return;
    }

    const token = getStoredToken();
    if (!token) {
      setConnected(false);
      return;
    }

    const client = new Client({
      brokerURL: buildWsUrl(token),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        access_token: token,
      },
      reconnectDelay: 4000,
      heartbeatIncoming: 15000,
      heartbeatOutgoing: 15000,
      beforeConnect: () => {
        const t = getStoredToken();
        if (!t) return;
        client.brokerURL = buildWsUrl(t);
        client.connectHeaders = {
          Authorization: `Bearer ${t}`,
          access_token: t,
        };
      },
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/store.${fournisseurId}`, (frame) => {
          try {
            const dto = JSON.parse(frame.body) as NotificationDTO;
            const qc = qcRef.current;
            qc.setQueryData<NotificationDTO[]>(['notifications'], (prev) => {
              const list = prev ?? [];
              if (list.some((n) => n.id === dto.id)) return list;
              return [dto, ...list];
            });
            if (!dto.read) {
              qc.setQueryData<number>(['notifications', 'unread-count'], (c) => (c ?? 0) + 1);
            }
            void qc.invalidateQueries({ queryKey: ['notifications'] });
          } catch {
            void qcRef.current.invalidateQueries({ queryKey: ['notifications'] });
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    clientRef.current = client;
    client.activate();

    return () => {
      clientRef.current = null;
      void client.deactivate();
      setConnected(false);
    };
  }, [fournisseurId]);

  return { connected };
}
