# ====== Build stage ======
FROM node:20-alpine AS build

RUN apk add --no-cache bash

WORKDIR /usr/src/app

# Build args (passados no docker build)
ARG VITE_TARGET_DATABASE
ARG TZ
ARG GIT_SHA

# Exporta para o ambiente (Vite lê VITE_*)
ENV VITE_TARGET_DATABASE=$VITE_TARGET_DATABASE
ENV TZ=$TZ
ENV GIT_SHA=$GIT_SHA

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ====== Runtime stage ======
FROM node:20-alpine AS runtime

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
