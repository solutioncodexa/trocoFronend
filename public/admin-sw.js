/*
 * Service worker minimal de l'administration : il rend l'application installable sur le téléphone.
 * Il ne met RIEN en cache — chaque requête passe par le réseau — pour ne jamais afficher une commande ou un
 * stock périmé. Le hors-ligne n'est volontairement pas géré.
 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  // Les appels non-GET (envoi de formulaires, uploads) ne sont pas interceptés.
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request));
});
