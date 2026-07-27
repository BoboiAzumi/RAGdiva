FROM nginx:1.31.3

COPY . /etc/nginx/conf.d

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]