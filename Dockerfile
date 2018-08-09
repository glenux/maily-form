#
# STAGE 1
# - Install and build necessary dependencies
# 
FROM node:10-alpine as build
MAINTAINER Jan-Lukas Else (https://about.jlelse.de)
COPY . /app
WORKDIR /app
RUN apk add --update sqlite-libs sqlite-dev \
        python build-base \
    && rm -rf /var/cache/apk/*

RUN npm install

#
# STAGE 2
# - Keep Only runtime libraries: no build tool is allowed in production.
#
FROM node:10-alpine
MAINTAINER Jan-Lukas Else (https://about.jlelse.de)

COPY --from=build /app /app
WORKDIR /app

RUN apk add --update sqlite-libs \
    && rm -rf /var/cache/apk/*

EXPOSE 8080
CMD npm start
