# Фронтенд
FROM node:alpine as build

WORKDIR /app

COPY package.json .
RUN npm install --force

COPY . .

RUN npm run build

# Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5000

CMD ["nginx","-g", "daemon off;"]