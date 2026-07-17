# Simple container to serve the production build with nginx
FROM nginx:1.27-alpine

# Copy build output
COPY dist/ /usr/share/nginx/html/

# Expose default nginx port
EXPOSE 80

# No CMD override: use default nginx entrypoint/cmd
