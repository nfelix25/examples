FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

ARG MONGO_IP

ENV MONGO_IP=${MONGO_IP}

CMD ["node", "server.js"]