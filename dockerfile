FROM node:20-slim

RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
RUN npm install --global serve
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]