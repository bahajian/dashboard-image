#!/bin/sh

echo "Injecting runtime environment variables..."

# Debug: Print out one or two environment variables to verify they're set
echo "VITE_APP_VERSION: $VITE_APP_VERSION"
echo "PUBLIC_URL: $PUBLIC_URL"

# Perform substitution: this reads env.template.js and writes env.js with substituted values.

envsubst < /usr/share/nginx/html/env.js > /usr/share/nginx/html/env.js.tmp && mv /usr/share/nginx/html/env.js.tmp /usr/share/nginx/html/env.js

echo "Environment variables injected. Contents of env.js:"
cat /usr/share/nginx/html/env.js

exec nginx -g "daemon off;"
