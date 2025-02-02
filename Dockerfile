# Use an official Nginx image from Docker Hub
FROM nginx:alpine

# Set the working directory to /usr/share/nginx/html (the default directory for nginx)
WORKDIR /usr/share/nginx/html

# Copy the app's HTML, CSS, and JS files into the container
COPY . .

# Expose port 80 to be able to access the app in the browser
EXPOSE 80

# Run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
