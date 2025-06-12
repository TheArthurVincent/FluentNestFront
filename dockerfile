FROM node:18.18
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
RUN npm install --global serve
COPY . .
RUN npm run build
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
EXPOSE 3000
CMD [ "npm", "start" ]