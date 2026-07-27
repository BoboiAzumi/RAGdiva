FROM node:26-alpine3.23

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY .env.docker ./.env

RUN npm install

COPY . .

RUN npm run build
RUN npm run setup-admin-prod

EXPOSE 3000

CMD ["npm", "run", "start"]