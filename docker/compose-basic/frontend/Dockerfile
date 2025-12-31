FROM node:20-alpine AS builder
# Builder stage uses Node to install dependencies and produce a static Vite build.
WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy remaining frontend files into the container before running the build.
COPY . .
# Build the production-ready assets (includes bundling, minification, etc.).
RUN npm run build
# Runtime stage uses nginx to serve the built assets: no Node runtime needed here.
FROM nginx:alpine
# Copy only the build output from the builder stage into nginx’s default web root.
COPY --from=builder /app/dist /usr/share/nginx/html
# Replace the default nginx config with one that always serves index.html for client-side routing.
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 so docker-compose can publish it to the host machine.
EXPOSE 80
