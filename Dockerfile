# Use an official Node.js runtime as the base image
FROM node:21 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app for production
RUN ng build --configuration=production

# Use nginx to serve the static content
FROM nginx:alpine
COPY --from=builder /app/dist/angular-frontend/browser /usr/share/nginx/html