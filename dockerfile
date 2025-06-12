# Usa a versão mínima necessária que evita os warnings de engine
FROM node:20.17.0

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install --legacy-peer-deps

# Instala globalmente o servidor estático
RUN npm install --global serve

# Copia o restante da aplicação
COPY . .

# Constrói a aplicação (ex: React, Vue)
RUN npm run build

# Expõe a porta do app
EXPOSE 3000

# Comando final para servir a pasta build (ideal para React)
CMD ["serve", "-s", "build", "-l", "3000"]