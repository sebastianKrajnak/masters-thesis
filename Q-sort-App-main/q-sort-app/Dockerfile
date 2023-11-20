# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /q-sort-app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container
COPY ./ .

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "dev"]