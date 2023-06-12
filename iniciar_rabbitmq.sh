# El puerto por defecto para usar RabbitMQ es 5672 (conexiones no cifradas)
# El puerto 5673 se usa para conexxiones cifradas
# El acceso a la consola se da por el puerto 15672
docker run -d --hostname adp-rabbit --name adp-rabbit -p 5672:5672 -p 5673:5673 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=adp -e RABBITMQ_DEFAULT_PASS=adp rabbitmq:3-management
