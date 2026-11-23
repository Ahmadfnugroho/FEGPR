# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
USER 0
RUN chmod +x /usr/local/bin/entrypoint \
 && chgrp -R 0 /usr/share/nginx/html /etc/nginx/conf.d \
 && chmod -R g=u /usr/share/nginx/html /etc/nginx/conf.d \
 && chown 101:101 /usr/share/nginx/html/config.js
USER 101
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/entrypoint"]
CMD ["nginx", "-g", "daemon off;"]