FROM node:26-alpine3.23

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install

COPY . .

RUN npm build

EXPOSE 3000

CMD ["npm", "run", "start"]