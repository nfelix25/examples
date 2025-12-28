FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

ENV IS_DOCKER=true

CMD ["node", "server.js"]