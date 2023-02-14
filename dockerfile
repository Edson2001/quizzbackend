FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE ${ENV_SERVER_PORT}

CMD ["yarn", "dev"]