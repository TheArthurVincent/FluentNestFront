FROM node:20.17.0

WORKDIR /usr/src/app

COPY package*.json ./

# Configura o npm para conexões mais resilientes
RUN npm config set registry https://registry.npmmirror.com \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000

# Instala as dependências com segurança
RUN npm ci --legacy-peer-deps

RUN npm install --global serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
