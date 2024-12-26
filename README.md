# dai-lab-infra
### Étudiants
- Perret Jonatan
- Riedo Jérôme

## Static web Site
Le serveur statique se trouve dans le dossier web-static.

Il est composé d'un site web statique, d'un fichier de configuration nginx.conf et du fichier dockerfile qui sert à créer l'image du serveur.

### Préparation du site web
Le site provient directement du site [Free-CSS](https://www.free-css.com/free-css-templates). Aucune modification n'a été faite. Il se trouve dans le dossier www.

### Configuration du serveur nginx
La configuration du serveur se trouve dans le fichier /etc/nginx/nginx.conf.

Pour le modifier, il faut l'importer :
> docker run --rm --entrypoint=cat nginx /etc/nginx/nginx.conf > ./nginx.conf

Modifier le fichier importé en ajoutant la section suivante à l'intérieur du bloc http.
>     server {
>       listen 80;
>       server_name myStaticWebSite;
>
>       location / {
>           root /usr/share/nginx/html;
>           index index.html;
>       }
>     }

[Explications détailées du fichier nginx.conf](./explications_configuration_nginx.md)


### Construire et exécuter l'image docker
Le fichier dockerfile est nécessaire pour la création de l'image.

Il permet de copier le contenu du site ainsi que la configuration du serveur dans l'image.

Création de l'image:
> docker build -t my-static-site .

Pour démarrer le serveur web:
> docker run -d -p 8080:80 my-static-site

Le site web est accessible sur http://localhost:8080

## Docker compose

La configuration de docker-compose se trouve dans le fichier compose.yml.

Il contient uniquement un service, le serveur web-static, qui est configuré pour être atteignable sur le port local 8080.

Afin de pouvoir construire l'image, il faut inclure une section "build". Celle-ci contient une ligne "context", qui définit le répertoire qui contient le fichier dockerfile du container à créer et la ligne "dockerfile" qui indique le nom du fichier dockerfile.

Commande pour créer l'image:
> docker compose build

Commande pour démarrer l'infrastructure (-d pour lancer en arrière plan)
> docker compose up -d

Le site web est maintenant accessible sur http://localhost:8080

Commande pour stopper l'infrastructure
> docker compose down

Toutes ces commandes doivent être exécutées dans le dossier contenant le fichier compose.yml.