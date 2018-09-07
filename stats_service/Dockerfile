FROM node:8

RUN apt-get update && npm i -g nodemon

RUN mkdir -p /home/node/app

COPY ./base/package.json /home/node/app/package.json

WORKDIR /home/node/app

RUN  npm install

CMD [ "npm", "start" ]
