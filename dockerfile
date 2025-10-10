FROM node:lts-alpine

RUN apk add --no-cache bash

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

# Comando para servir a aplicação
CMD ["serve", "-s", "dist", "-l", "3000"]