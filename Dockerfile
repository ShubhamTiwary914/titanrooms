#image for the backend server 

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY build ./build

EXPOSE 3000

CMD ["node", "build/main.js"]