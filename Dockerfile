FROM node:16.16-bullseye

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app 

COPY --chown=node:node package-lock.json package.json ./

RUN rm -rf node_modules && npm ci 

COPY --chown=node:node . .

COPY --chown=node:node .env ./dist/

WORKDIR /home/node/app/dist/

CMD npm run debug
