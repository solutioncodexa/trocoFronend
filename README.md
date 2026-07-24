# Troco Frontend

Frontend web de Troco (React + Vite + TypeScript).

## Prérequis

- Node.js 20+
- npm

## Démarrage local

```sh
npm ci
npm run dev
```

L'application est servie en local sur le port configuré dans `vite.config.ts`.

## Build production

```sh
npm run build
npm run preview
```

## Stack technique

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Déploiement

Le déploiement se fait via GitHub Actions avec artefacts locaux (dist), puis redémarrage du service `frontend` sur le VPS via Docker Compose.
