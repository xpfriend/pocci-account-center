FROM xpfriend/workspace-nodejs:2.21.0
MAINTAINER ototadana@gmail.com

RUN git clone https://github.com/xpfriend/pocci-account-center.git

RUN source ~/.nvm/nvm.sh \
    && cd pocci-account-center \
    && npm install \
    && gulp


WORKDIR /tmp/pocci-account-center

CMD ["node", "./server.js"]
