## Explication du contenu du fichier nginx.conf


~~~~
 user  nginx;
~~~~

Utilisateur avec lequel nginx s'exécute.

~~~~
 worker_processes  auto;
~~~~

Configure automatiquement le nombre de worker en fonction du nombre de CPU disponible.

~~~~
 error_log  /var/log/nginx/error.log notice;
~~~~

Définit l'endroit ou nginx écrit les logs et le niveau de log.

~~~~ 
 pid        /var/run/nginx.pid;
~~~~

C'est un fichier qui sauve le process ID de nginx. Cela permet de redémarrer (ou de stopper) le serveur proprement.

~~~~
 events {
    worker_connections  1024;
 }
~~~~

Le bloc events concerne les connections réseaux.

worker_connections définit le nombre de connections simultanées qu'il peut y avoir pour un "worker_processes"

~~~~
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen 80;
        server_name myStaticWebSite;

        location / {
            root /usr/share/nginx/html;
            index index.html;
        }
    }
}
~~~~

Ceci est le bloc principal pour configurer la gestion des requêtes http (ou https).

~~~~
    include       /etc/nginx/mime.types;
~~~~
Fichier qui sert à garantir que les fichiers sont servis avec le bon type de contenu (ex. .html->text.html)

~~~~
    default_type  application/octet-stream;
~~~~
Si Nginx ne peut pas déterminer le type de fichier, il l'envoie en tant que binaire générique.

~~~~
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';


    access_log  /var/log/nginx/access.log  main;
~~~~
activation et format des logs des requêtes http.


~~~~
    sendfile        on;
~~~~
Permet à Nginx de transférer des fichiers directement du disque au réseau, sans passer par l'application. Ca améliore la vitesse pour les fichiers statiques

~~~~
    #tcp_nopush     on;
~~~~
Pour envoyer les gros fichiers en un seul paquet (commenté par défaut)

~~~~
    keepalive_timeout  65;
~~~~
Garde la connection ouverte durant 65 secondes pour diminuer la latence lors de requêtes successives.

~~~~
    #gzip  on;
~~~~
Permet de compresser les fichiers transférés (commenté par défaut)

~~~~
    include /etc/nginx/conf.d/*.conf;
~~~~
Pour charger les fichiers de configurations (ils peuvent être différents pour chaque sites web)

~~~~
    server {
        listen 80;
        server_name myStaticWebSite;

        location / {
            root /usr/share/nginx/html;
            index index.html;
        }
    }
~~~~
Définition d'un serveur virtuel qui écoute sur le port 80 et répond également au nom "server_name". La location indique ou se trouvent les fichiers du site web et la dernière ligne permet de charger index.html automatiquement lorsqu'un utilisateur accède à la racine du site.