# =============================================================================
# Reverse proxy Dockerfile
# =============================================================================
FROM nginx:1.27-alpine

# Remove default config, add ours
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
