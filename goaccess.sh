
#!/bin/bash
while true
do
 goaccess /var/log/nginx/access.log -a -d -o /var/www/html/belajarnode/belajar-node/public/laporan.json
 sleep 3
done
