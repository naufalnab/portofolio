FROM php:8.2-apache

# Enable Apache mod_rewrite if needed
RUN a2enmod rewrite

# Install required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Set working directory
WORKDIR /var/www/html

# The application files will be mounted as a volume in docker-compose.yml,
# but we can also copy them here if we want to build a self-contained image.
COPY . /var/www/html/

# Update permissions
RUN chown -R www-data:www-data /var/www/html/
