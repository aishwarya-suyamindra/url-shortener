# load the base image
FROM node:17-alpine

# install nodemon
RUN npm install -g nodemon

WORKDIR /app
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 4500
ENTRYPOINT ["nodemon", "index.js"]
CMD []