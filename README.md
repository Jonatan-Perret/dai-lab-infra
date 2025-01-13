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

## HTTP API server

Notre API représente la gestion d'une cave à vin.

Les opérations suivantes sont disponibles :
 - voir la liste de tous les vins (GET)
 - voir la liste des vins rouges (GET)
 - voir la liste des vins blancs (GET)
 - voir la liste des vins rosés (GET)
 - créer un nouveau vin (CREATE)
 - mettre à jour un vin (POST)
 - mettre à jour la quantité d'un vin(PATCH)
 - supprimer un vin (DELETE)

La liste des requête pour Hoppscotch se trouve dans le fichier [hoppscotch_test.json](./web-api/hoppscotch_test.json).

Le serveur écoute sur le port 7000.

Pour créer l'exécutable java (depuis le dossier web-api/javalin/):
> mvn clean package

Le fichier compose.yml a été mis à jour pour inclure notre serveur API. Pour créer puis démarrer l'infrastructure, il faut utiliser les commandes décrites dans le chapitre [Docker compose](#docker-compose).

## Reverse proxy
### fichier hosts
Pour accéder aux différents services, il faut ajouter les lignes suivantes dans le fichier hosts:
>     127.0.0.1 web.dai.heig-vd.ch
>     127.0.0.1 api.dai.heig-vd.ch

cela permet que notre navigateur redirige les requêtes vers notre machine locale pour les noms de domaines web.dai.heig-vd.ch et api.dai.heig-vd.ch et ainsi que Traefik puisse rediriger les requêtes vers les services correspondants via le nom de domaine dans le header de la requête.

### Traefik
Traefik est un reverse proxy qui permet de rediriger les requêtes vers les différents services en fonction de leur nom de domaine.

Le fichier docker-compose.yml contient la configuration de Traefik et des services web-static et web-api.

Exemple de configuration pour le service web-static:
>     labels: 
>       - "traefik.http.routers.web-static.rule=Host(`web.dai.heig-vd.ch`)"

Exemple de configuration pour le service web-api:
>     labels:
>       - "traefik.http.routers.web-api.rule=Host(`api.dai.heig-vd.ch`)"

Le dashboard de Traefik est accessible sur http://localhost:8080

On utilise le "réseau interne" de docker pour que Traefik puisse communiquer avec les services.
Cela permet de ne pas exposé les ports des services directement sur la machine hôte.

Utilisation du routeur de traefik pour rediriger les requêtes vers les services correspondants.

## Load balancing
### Auto-scaling
Pour l'auto-scaling, nous utilisons docker-compose et Traefik.

Le fichier docker-compose.yml contient la configuration de Traefik et des services web-static et web-api.

utilisations des replicas
>     web-static:
>       build:
>           context: ./web-static/
>           dockerfile: dockerfile
>       labels:
>           traefik.http.routers.web-static.rule: Host(`web.dai.heig-vd.ch`)
>       # auto-scaling
>       deploy:
>           replicas: 1 # nombre de réplicas
>     web-api:
>       build:
>           context: ./web-api/
>           dockerfile: Dockerfile
>       labels:
>           traefik.http.routers.web-api.rule: Host(`api.dai.heig-vd.ch`)
>       # auto-scaling
>       deploy:
>           replicas: 3 # nombre de réplicas
>       #ports:
>       #  - "7000:7000" # Uncomment if external access to this service is required without traefik
>       restart: unless-stopped

Pour lancer l'infrastructure:
>     docker compose up -d --scale web-api=3 --scale web-static=3

expliquation de la commande:
- --scale web-api=3 : permet de lancer 3 replicas du service web-api
- --scale web-static=3 : permet de lancer 3 replicas du service web-static

pour changer le nombre de replicas, il suffit de modifier le nombre après le = et relancer la commande.

exemple pour lancer 5 replicas du service web-api:
>     docker compose up -d --scale web-api=5 --scale web-static=10

Pour tester l'auto-scaling, il faut utiliser un outil de stress test comme [ab](https://httpd.apache.org/docs/2.4/programs/ab.html)

Commande pour lancer un stress test:
>     ab -n 1000000 -c 1000 http://web.dai.heig-vd.ch/

### Load balancing entre replicas avec sticky sessions
Pour le load balancing entre les replicas, nous utilisons Traefik.

Traefik permet de gérer le load balancing entre les replicas des services.

Pour activer les sticky sessions, il faut ajouter la ligne suivante dans la configuration du service:

>     labels:
>       - "traefik.http.services.web-api.loadbalancer.sticky=true"

### Test le load balancing
Pour tester le load balancing, il faut activer les logs de Traefik afin de voir les requêtes redirigées vers les différents replicas.

Pour activer les logs, il faut ajouter la ligne suivante dans le fichier docker-compose.yml:

>        command:
>          - "--accesslog=true"
>          - "--log.level=DEBUG"
>          - "--accesslog.filepath=/var/logs/access.log"
>          - "--log.filepath=/var/logs/traefik/access.log"
>       volumes:
>         - ./logs:/var/logs

Pour voir les logs:
>     tail logs/access.log


