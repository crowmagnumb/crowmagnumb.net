# crowmagnumb.net

## Digital Ocean

In DO I have the text record `_atproto.crowmagnumb.net` which I added so that BlueSky can verify my account against a valid domain.

## CalDAV/CardDAV

Using `radicale.org`. Followed setup in `https://radicale.org/v3.html` but had to use `--break-system-packages` to get this to work.

```sh
python3 -m pip install --upgrade https://github.com/Kozea/Radicale/archive/master.tar.gz --break-system-packages
sudo mkdir -p /etc/radicale
sudo apt-get install apache2-utils
sudo htpasswd -c /etc/radicale/users crowmagnumb
sudo nano /etc/radicale/config
```

```conf
[auth]
type = htpasswd
htpasswd_filename = /etc/radicale/users
htpasswd_encryption = autodetect
[server]
hosts = 0.0.0.0:5232, [::]:5232
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

### Apache

```sh
sudo nano /etc/apache2/sites-available/radicale.conf
```
sudo systemctl status radicale

```conf
RewriteEngine On
RewriteRule ^/radicale$ /radicale/ [R,L]

<Location "/radicale/">
    ProxyPass        http://localhost:5232/ retry=0
    ProxyPassReverse http://localhost:5232/
    RequestHeader    set X-Script-Name /radicale
    RequestHeader    set X-Forwarded-Port "%{SERVER_PORT}s"
    RequestHeader    unset X-Forwarded-Proto
    <If "%{HTTPS} =~ /on/">
    RequestHeader    set X-Forwarded-Proto "https"
    </If>
</Location>
```

```sh
sudo systemctl reload apache2
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
