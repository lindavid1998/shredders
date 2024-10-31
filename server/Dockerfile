# syntax = docker/dockerfile:1.2

FROM node:alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN --mount=type=secret,id=db_password,dst=/etc/secrets/db_password
ENV DB_PASSWORD_FILE=/etc/secrets/db_password

EXPOSE 3000

# start the server
CMD ["npm", "start"]
