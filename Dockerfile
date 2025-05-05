#Construir aplicacion Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

#Servir aplicacion con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/rev-tramites /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "deamon off;"]
