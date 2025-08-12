# syntax = docker/dockerfile:1.2

FROM node:alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

# this is needed for Render to mount the secrets 
RUN --mount=type=secret,id=db_password,dst=/etc/secrets/db_password
RUN --mount=type=secret,id=redis_password,dst=/etc/secrets/redis_password
ENV DB_PASSWORD_FILE=/etc/secrets/db_password
ENV REDIS_PASSWORD_FILE=/etc/secrets/redis_password

EXPOSE 3000

# start the server
CMD ["npm", "run", "start:all"]
