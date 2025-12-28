FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./server.js ./server.js

# Use build argument EXTERNAL_PORT with EXPOSE
ARG EXTERNAL_PORT
EXPOSE ${EXTERNAL_PORT}

# Use build argument INTERNAL_PORT with ENV
ARG INTERNAL_PORT
ENV PORT=${INTERNAL_PORT}

CMD ["node", "server.js"]