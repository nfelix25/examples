FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./server.js ./server.js

# Args introduce layers and should be placed as close to their usage as possible to avoid unnecessary rebuilds.

# Use build argument EXTERNAL_PORT with EXPOSE
ARG EXTERNAL_PORT
EXPOSE ${EXTERNAL_PORT}

# Use build argument INTERNAL_PORT with ENV
ARG INTERNAL_PORT
ENV PORT=${INTERNAL_PORT}

CMD ["node", "server.js"]