FROM node

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 8008

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["node", "server.js"]

# docker run -d -p 3003:8008 --rm --name app -v quotes:/app/quotes IMAGE_ID