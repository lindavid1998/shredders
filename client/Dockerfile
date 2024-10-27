FROM node:alpine

# set the working directory
WORKDIR /app

# copy package.json files into container directory
COPY package.json .
COPY package-lock.json .

# install the dependencies
RUN npm install

COPY . .

# EXPOSE 5100
EXPOSE 5173

CMD ["npm", "run", "dev"]
