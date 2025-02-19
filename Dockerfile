# Stage 1: Build the React Vite app
FROM node:20 AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Stage 2: Serve with Nginx and inject runtime configuration
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Install gettext for envsubst
RUN apk --no-cache add gettext

# Copy built app from the builder stage
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy runtime environment template file with placeholders (e.g., __VITE_API_URL__, __SECRET_KEY__)
COPY env.template.js /usr/share/nginx/html/env.js

# Copy the entrypoint script that will replace placeholders at container startup
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Ensure appropriate permissions for static assets
RUN chmod -R 777 /usr/share/nginx/html/assets

# Set the entrypoint script to run on container start
ENTRYPOINT ["/entrypoint.sh"]

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
