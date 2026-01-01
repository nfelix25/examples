FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

# COPY src .

# COPY php-entrypoint.sh /usr/local/bin/

RUN docker-php-ext-install pdo pdo_mysql

# RUN chmod +x /usr/local/bin/php-entrypoint.sh

RUN chown -R www-data:www-data /var/www/html

# ENTRYPOINT [ "php-entrypoint.sh" ]