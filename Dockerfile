# -------------------------------
# Etapa 1: Build de Angular
# -------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar resto de la app
COPY . .

# Construir para producción
RUN npm run build -- --configuration production

# -------------------------------
# Etapa 2: Servir con NGINX
# -------------------------------
FROM nginx:alpine

# Copiar artefactos construidos
COPY --from=build /app/dist/rev-tramites/browser /usr/share/nginx/html

# Copiar configuración de NGINX personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Asegurar permisos para el usuario nginx
RUN chown -R nginx:nginx /usr/share/nginx/html

# Exponer puerto HTTP
EXPOSE 80

# Usar explícitamente usuario no root
USER nginx

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
