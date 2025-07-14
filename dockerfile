FROM node:20.11.1-slim

RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./

# Instalar TODAS as dependências (incluindo dev) para o build
RUN npm install

COPY . .

# Fazer o build
RUN npm run build

# Instalar serve globalmente
RUN npm install --global serve

EXPOSE 3000
CMD [ "npm", "start" ]