#!/bin/sh

echo "Injecting environment variables into app..."

# Replace placeholders in JavaScript files (use envsubst or sed)
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i \
  -e "s|VITE_APP_API_URL_PLACEHOLDER|${VITE_APP_API_URL}|g" \
  -e "s|VITE_APP_BASE_NAME_PLACEHOLDER|${VITE_APP_BASE_NAME}|g" \
  -e "s|VITE_APP_AWS_POOL_ID_PLACEHOLDER|${VITE_APP_AWS_POOL_ID}|g" \
  -e "s|VITE_APP_AWS_APP_CLIENT_ID_PLACEHOLDER|${VITE_APP_AWS_APP_CLIENT_ID}|g" \
  -e "s|VITE_STRIPE_PUBLISHABLE_KEY_PLACEHOLDER|${VITE_STRIPE_PUBLISHABLE_KEY}|g" {} +

echo "Starting Nginx..."
exec "$@"
