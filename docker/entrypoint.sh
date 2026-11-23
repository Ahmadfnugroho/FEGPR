#!/bin/sh
set -eu

: "${VITE_API_URL:?VITE_API_URL is required}"
: "${VITE_API_KEY:?VITE_API_KEY is required}"

cat > /usr/share/nginx/html/config.js <<EOF
window.__ENV__ = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_API_KEY: "${VITE_API_KEY}"
};
EOF

exec "$@"