FROM node:26-alpine3.23

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.31.3

WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf

COPY ./dist ./var/www/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]