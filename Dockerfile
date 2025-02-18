# Stage 1: Build the React Vite app
FROM node:20 AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy built app
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure required directories exist and set correct permissions
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp && \
    chown -R nginx:nginx /var/cache/nginx



# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# Set the entrypoint script to run on container start
ENTRYPOINT ["/entrypoint.sh"]

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]