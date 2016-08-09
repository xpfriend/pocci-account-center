FROM alpine:3.4
MAINTAINER ototadana@gmail.com

ENV NODEJS_VERSION 6.2.0-r0

RUN apk add --no-cache nodejs=${NODEJS_VERSION} git

COPY ./package.json /pocci-account-center/
RUN cd /pocci-account-center/ && npm install

WORKDIR /pocci-account-center
CMD ["node", "./server.js"]

COPY ./. /pocci-account-center/
RUN ./node_modules/.bin/gulp
