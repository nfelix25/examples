FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Use build argument INTERNAL_PORT with EXPOSE
ARG INTERNAL_PORT
EXPOSE ${INTERNAL_PORT}

# Use build argument EXTERNAL_PORT with ENV
ARG EXTERNAL_PORT
ENV PORT=${EXTERNAL_PORT}

CMD ["node", "server.js"]