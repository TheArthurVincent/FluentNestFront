FROM node:18.18

# Cria o diretório da aplicação
WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY package*.json ./

# Ajustes de rede para evitar timeout durante o npm install
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

# Instala as dependências ignorando conflitos de versões
RUN npm install --legacy-peer-deps

# Instala o servidor estático
RUN npm install --global serve

# Copia o restante da aplicação
COPY . .

# Cria o build de produção (React)
RUN npm run build

# Expõe a porta padrão
EXPOSE 3000

# Serve a aplicação estática do React
CMD ["npm", "start" ,"serve", "-s", "build"]
