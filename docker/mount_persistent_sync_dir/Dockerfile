FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9009

CMD ["npm", "start"]

# docker run -p 3003:9009 -v ~/Code/docker-examples/mount_persistent_sync_dir/notes/:/app/notes IMAGE_ID