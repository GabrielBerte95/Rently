# syntax=docker/dockerfile:1

# ---------- Build stage (Angular) ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# ---------- Runtime stage (Nginx) ----------
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
# O builder do Angular emite os artefatos em dist/rently/browser
COPY --from=build /app/dist/rently/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
