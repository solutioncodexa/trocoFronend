# =============================================================================
# Goldyara Frontend — Dockerfile multi-stage
# =============================================================================
# Stage 1 : build Vite avec Node
# Stage 2 : Nginx Alpine servant le contenu statique
# =============================================================================

# ---------- 1. BUILD ----------
FROM node:20-alpine AS build

# Relatif recommandé : le navigateur appelle le même hôte que le site (Nginx -> backend).
# Surcharge seulement si besoin d'un domaine API différent du front.
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

WORKDIR /app

# Layer cache : on installe les deps en premier
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Code source
COPY . .

# Vite build — sortie dans dist/
RUN npm run build


# ---------- 2. RUNTIME ----------
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Healthcheck simple
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://localhost/healthz || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
