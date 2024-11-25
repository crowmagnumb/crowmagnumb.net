# crowmagnumb.net

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
sudo systemctl status radicale
sudo journalctl --unit radicale.service
```

### Apache

```sh
sudo nano /etc/apache2/sites-available/radicale.conf
```

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