FROM node:20

# Cria o diretório da aplicação
WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY package*.json ./

# Ajusta configurações de rede para evitar timeout
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

# Instala as dependências
RUN npm install

# Instala o "serve" globalmente
RUN npm install --global serve

# Copia o restante do código
COPY . .

# Cria o build de produção do React
RUN npm run build

# Expõe a porta padrão do "serve"
EXPOSE 3000

# Inicia o app
CMD ["npm", "start" ,"serve", "-s", "build"]
