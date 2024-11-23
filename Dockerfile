# Use an official Node.js runtime as a parent image
FROM node:20.16.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN npm rebuild bcrypt --build-from-source
# Expose the port the app runs on
EXPOSE 6000
# Define the command to run the app
CMD ["sh", "-c", "npm run dev & npm run worker"]


#172.21.112.1