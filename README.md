# crowmagnumb.net

## Things to add

- Random Names generator (get from croword or put it up there)
- Photo manipulator fun code
- Oathroll
- How to expose/edit my contacts via the web rather than having to use my phone app to do it

## Digital Ocean

In DO I have the text record `_atproto.crowmagnumb.net` which I added so that BlueSky can verify my account against a valid domain.

## Docker

We will ultimately have a structure like this....

```sh
/opt/crowmagnumb.net/
├─ docker-compose.yml
├─ website/
│   ├─ index.html
│   └─ <etc.>
├─ radicale/
│   ├─ config/
│   │   └─ radicale.conf          
│   ├─ users # <-- the htpasswd file
│   └─ data/ # <-- calendar/contact storage
```

```sh
rsync -avz docker/ crowmagnumb.net:/opt/crowmagnumb.net
scp systemd/crowmagnumb.net.service root@crowmagnumb.net:/etc/systemd/system
ssh crowmagnumb.net sudo systemctl daemon-reload
ssh crowmagnumb.net sudo systemctl enable crowmagnumb.net
```

### compose file

```yml
networks:
  webnet:
    driver: bridge
```

This creates a private Docker network called webnet.
`Bridge driver` is the default Docker networking mode for containers on a single host.
When the compose file starts, Docker automatically builds an isolated virtual LAN (a Linux bridge) and attaches every service that declares `networks: - webnet` to it.

This gives you:
- Service‑to‑service communication.
    - Containers can talk to each other by service name (traefik, radicale, etc.) instead of IP addresses. E.g. Traefik forwards a request to radicale:5232 because both are on webnet.
- Isolation from the host network
    - Only containers on webnet can see each other. Other containers on different networks (or the host itself) cannot reach the Radicale port unless you explicitly publish it (ports:) – which you don’t for the internal services.
- Simplifies DNS resolution
    - Docker supplies an internal DNS server for the network, so radicale resolves to the correct container IP automatically.
- Consistent IP addressing
    - Docker assigns stable IPs within the network for the lifetime of the compose stack, avoiding clashes with other apps you might run on the same host.
- Scope for future services
    - If you later add a web UI, a backup container, or a monitoring agent, you just attach it to webnet and it can reach Radicale (or any other service) without exposing extra ports to the public internet.

Start it
```sh
cd /opt/crowmagnumb.net
docker compose up -d
```

Stop it
```sh
docker compose stop
```

List running dockers ...
```sh
docker compose ls
```

Run a command inside a running docker container ...

```sh
docker compose exec -it <container-name> <cmd>
```
e.g.
```sh
docker compose exec -it radicale cat /etc/radicale/users
```

logs
```sh
docker logs <-f> <container-name>
```

restart...
```sh
docker compose restart
```

#### How Traefik discovers and interprets Docker labels

Traefik is a dynamic reverse‑proxy.

When it starts (or when the Docker daemon notifies it of a change), it asks Docker for a list of running containers and reads the metadata that Docker stores on each container.
That metadata includes the key‑value pairs you define with the labels: section of a docker‑compose.yml file.

Traefik treats any label on other services whose key begins with the `traefik.` prefix as configuration that belongs to it. Everything after that prefix follows a strict naming scheme that tells Traefik what to create (router, service, middleware, etc.) and how to wire them together.

Below is a step‑by‑step walk‑through of the whole process.

Traefik’s Docker provider must be enabled hence the lines...

```yml
command:
  - "--providers.docker=true"
  - "--providers.docker.exposedbydefault=false"
```

`--providers.docker=true` – tells Traefik to watch the Docker API.
`--providers.docker.exposedbydefault=false` – prevents every container from being automatically exposed; only containers that carry a traefik.enable=true label (or any other explicit label) will be considered.

When Traefik boots, it opens a connection to the Docker socket (/var/run/docker.sock) and continuously receives events (container start, stop, die, update, …). Every time an event occurs, Traefik re‑reads the container list and rebuilds its internal configuration.

## Add User

```sh
docker compose exec -it radicale sudo htpasswd /config/users <other_user>
```

### Backing up

```sh
ssh crowmagnumb.net sudo tar -czf ~/radicale.tgz -C /opt crowmagnumb.net; scp crowmagnumb.net:./radicale.tgz ~/Documents/personal
```

### Querying

Search through vcf files in radicale on crowmagnumb.net. For now I'm using root because I don't want to change the permissions in /var/lib to ken.

```
ssh root@crowmagnumb.net
cd /var/lib/radicale/collections/collection-root/crowmagnumb/51ef49e4-103b-0be4-db0b-077e203934bd/
grep -rlc "EMAIL" . | xargs -I {} bash -c 'if [ $(grep -o "EMAIL" {} | wc -l) -eq 2 ]; then echo {}; fi'
```

### Starting AUCore app

- Create Critterspot DB with structure only and then remove everything CS related. Then save that as a starting point with appropriate flyway version locking. So have whatever entry you need in that one table, or instructions for adding it after loading so that updates from that point take affect.
- Publish crowjson, crowlang, crowdb, au-root, au-http, etc. (with source) so that you can import these. Some at least only locally?
- Figure the best way to locally publish the javascript libraries as well.

## Four Square Places

- https://docs.foursquare.com/data-products/docs/access-fsq-os-places
- https://opensource.foursquare.com/os-places/

## TODO

- Next Steps
  8. Then, finally get mailman working in there as noted below.
  9. Get rid of crowmail repo which is no longer needed.
- If I switch radicale successfully to the docker, I can get rid of my system user `radicale` that I created above. And uninstall radicale too!
- Bring in docker stuff from `crowmail` repo. We would just need a `mailman` volume under the `/opt/crowmagnumb.net`.
- Put my static page at something like `/users/crowmagnumb/mypage` just for now until I figure out where static pages could go. Because I want to add a basic angular app to start adding my ideas of oathroll, etc.
- Can I have a part of the site or just some other app where I can write a super quick markdown file on my computer and then have it be immediately available on my phone. I need something super quick like that all the time. What to do tonight? Some one-off recipe I want to try. etc.
