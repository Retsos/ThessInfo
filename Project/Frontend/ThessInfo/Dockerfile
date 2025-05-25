# frontend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# copy package manifest and install
COPY package*.json ./
RUN npm ci

# copy rest of source
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]