FROM node:current-alpine3.16 as builder

COPY package.json yarn.lock ./

RUN yarn && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY . .

RUN yarn build

FROM nginx:latest

#!/bin/sh
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]