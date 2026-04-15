# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy the rest of the application
COPY . .
# Build the Vite application
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copy the build output from the build stage to NGINX standard directory
COPY --from=build /app/dist /usr/share/nginx/html
# Replace default nginx configuration if necessary, otherwise the default serves static files fine
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
