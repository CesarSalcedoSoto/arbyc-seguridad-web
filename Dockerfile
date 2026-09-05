# ─── Etapa 1: Construcción del Frontend ─────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar bundle Vite
COPY . .
RUN npm run build

# ─── Etapa 2: Entorno de Ejecución en Producción ─────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiar dependencias y manifiesto
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar backend y bundle compilado de la etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Crear directorios para volúmenes de correo y persistencia
RUN mkdir -p /app/mail-config /app/vmail /app/data

EXPOSE 3000

# Ejecutar el servidor Express (sirve tanto la API /api/admin/* como el frontend SPA)
CMD ["node", "server/index.js"]
