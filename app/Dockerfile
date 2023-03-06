# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /Webserver_Leaguify
COPY . .
RUN yarn install --production
CMD ["node", "server.js"]
EXPOSE 3000