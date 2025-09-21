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
scp -r docker crowmagnumb.net:/opt/crowmagnumb.net
```

On crowmagnumb.net do ...

```sh
cd /opt/crowmagnumb.net
cp <user_file> /opt/crowmagnumb.net/radicale
cp -r <data_dir> /opt/crowmagnumb.net/data
```

Where <user_file> is a backup of you user/passwd file. And <data_dir> is your untarred backup of your radicale data.

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

## CalDAV/CardDAV

Using `radicale.org`. Followed setup in `https://radicale.org/v3.html` but had to use `--break-system-packages` to get this to work.

```sh
python3 -m pip install --upgrade https://github.com/Kozea/Radicale/archive/master.tar.gz --break-system-packages
sudo mkdir -p /etc/radicale
sudo apt-get install apache2-utils

sudo htpasswd -c /etc/radicale/users crowmagnumb
# To add another user leave off the -c, I think radicale reads this on every request so
# there should be no need to restart it.
sudo htpasswd /etc/radicale/users <other_user>
```
Create the config file...
```sh
sudo nano /etc/radicale/config
```

```conf
```

```sh
sudo useradd --system --user-group --home-dir / --shell /sbin/nologin radicale
sudo nano /etc/systemd/system/radicale.service
```

```conf
[Unit]
Description=A simple CalDAV (calendar) and CardDAV (contact) server
After=network.target
Requires=network.target

[Service]
ExecStart=/usr/bin/env python3 -m radicale
Restart=on-failure
User=radicale
# Deny other users access to the calendar data
UMask=0027
# Optional security settings
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
PrivateDevices=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
NoNewPrivileges=true
ReadWritePaths=/var/lib/radicale/collections

[Install]
WantedBy=multi-user.target
```

```sh
# collections are by default stored in `/var/lib/radicale/collections`
sudo mkdir -p /var/lib/radicale/collections
sudo chown -R radicale:radicale /var/lib/radicale/collections
sudo chmod -R o= /var/lib/radicale/collections
sudo systemctl enable radicale
sudo systemctl start radicale
sudo journalctl --unit radicale.service
```

### Backing up

```sh
ssh crowmagnumb.net tar -czf ~/radicale.tgz -C /var/lib radicale; scp crowmagnumb.net:./radicale.tgz ~/Documents/personal
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
  1. First comment out the radicale section of `docker-compose.yml`
  2. Shut down apache2
  3. Start docker
  4. See if the website and radicale are still both accessible
  5. Comment radicale back in.
  6. Shut down radicale locally.
  7. Now see if radicale working again. Please try and change weird uuid behaviour below.
  8. Then, finally get mailman working in there as noted below.
  9. Get rid of crowmail repo which is no longer needed.
- If I switch radicale successfully to the docker, I can get rid of my system user `radicale` that I created above. And uninstall radicale too!
- I have my contacts in `/var/lib/radicale/collections/collection-root/crowmagnumb/51ef49e4-103b-0be4-db0b-077e203934bd/` but I have no idea where the large hex-string came from. Why is it not just `contacts`? Also, I don't think we need `collections/collection-root`. Can we just get rid of that?
- Bring in docker stuff from `crowmail` repo. We would just need a `mailman` volume under the `/opt/crowmagnumb.net`.