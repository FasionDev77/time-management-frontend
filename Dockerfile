FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite's default port
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]