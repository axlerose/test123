# Stage 1: Base Node environment
FROM node:18-bullseye-slim

# Install yarn
RUN npm install -g yarn

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock (if it exists)
COPY package.json ./
# Try to copy yarn.lock, but don't fail if it's not there (e.g., first run)
COPY yarn.lock ./yarn.lock 2>/dev/null || true

# Install dependencies using Yarn
# This will create a yarn.lock if one doesn't exist
RUN yarn install --network-timeout 100000

# Copy the rest of the application code
# (Ensure .dockerignore is set up correctly on the host to exclude node_modules if any exist locally)
COPY . .

# Expose the Metro bundler port
EXPOSE 8081

# Command to run the Metro bundler
# This will typically start the development server
CMD ["yarn", "start"]
