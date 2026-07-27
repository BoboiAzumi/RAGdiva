FROM nginx:1.31.3

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]