
#!/bin/bash
while true
do
 goaccess /var/log/nginx/access.log -o /var/www/html/belajarnode/mainscript/public/status.html --real-time-html
 sleep 3
done
