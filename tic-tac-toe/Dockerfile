FROM node:18-alpine

WORKDIR /app
COPY package*.json /

RUN npm install -g nodemon && npm install
COPY . /
CMD ["npm", "run", "start"]