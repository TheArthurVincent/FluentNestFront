# Usa uma versão mais recente e compatível do Node.js
FROM node:20

# Define diretório de trabalho no container
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependência
COPY package*.json ./

# Limpa cache e instala as dependências com mais segurança
RUN npm cache clean --force && npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Constrói a aplicação para produção (caso use React ou similar)
RUN npm run build

# Expõe a porta (ajuste se for diferente)
EXPOSE 3000

# Usa um servidor estático leve para servir o front (como serve ou http-server)
# Instale serve globalmente e use isso como entrypoint
RUN npm install -g serve

# Serve a aplicação do diretório de build (ajuste se necessário)
CMD ["npm", "start" ,"serve",  "-s", "build", "-l", "3000"]
