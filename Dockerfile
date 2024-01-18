FROM node:16-alpine

RUN apk update && apk add redis

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD sh -c "redis-server --daemonize yes && npm run build && npm start"