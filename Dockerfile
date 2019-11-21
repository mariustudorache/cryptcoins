FROM node:latest

WORKDIR /var/www/app

COPY package.json ./

# npm install
RUN npm install


COPY . .


EXPOSE 3000 6379

CMD ["npm" ,"start"]