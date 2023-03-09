FROM node:19
WORKDIR /app/src/
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "src/server.js"]
EXPOSE 3000