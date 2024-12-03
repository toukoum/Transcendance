FROM nginx:alpine

RUN mkdir -p /etc/nginx/ssl

RUN apk add --no-cache openssl

RUN openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/selfsigned.key \
    -out /etc/nginx/ssl/selfsigned.crt \
    -subj "/C=FR/ST=Ile-de-France/L=Paris/O=42_School/OU=FT_Transcendence/CN=10.32.8.13"

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
