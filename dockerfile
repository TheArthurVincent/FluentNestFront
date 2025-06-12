FROM node:20.17.0

WORKDIR /usr/src/app

COPY package*.json ./

# Usa o registry oficial para evitar erro com pacotes específicos como styled-components
RUN npm config set registry https://registry.npmjs.org \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000

# Instala com segurança e compatibilidade
RUN npm ci --legacy-peer-deps

RUN npm install --global serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
