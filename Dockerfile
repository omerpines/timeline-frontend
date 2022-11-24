FROM node:16.18.0 AS build
RUN apt update
RUN npm install -g n && \
	n 16.18.0 stable && \
	yarn add csv-parse
COPY frontend/. /react
WORKDIR /react
RUN yarn install
RUN yarn build
FROM ubuntu/apache2
COPY --from=build /react/build/. /var/www/html
RUN a2enmod rewrite && \
    sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf
