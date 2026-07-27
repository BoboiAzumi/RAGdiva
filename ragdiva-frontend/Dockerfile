FROM node:26-alpine3.23 AS builder

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.31.3

WORKDIR /app

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir /var/www
RUN mkdir /var/www/html
COPY --from=builder /app/dist /var/www/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]