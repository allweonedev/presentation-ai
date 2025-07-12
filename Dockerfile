FROM node:alpine3.22

WORKDIR /app
RUN apk --update --no-cache add git \
  openssl \
  && git clone https://github.com/allweonedev/presentation-ai.git . \
  && npm install -g pnpm@latest-10 \
  && rm -f .example.env

COPY .env /app

RUN pnpm install
