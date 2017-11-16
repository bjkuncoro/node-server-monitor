#!/bin/bash
pm2 start monitor/app.js
pm2 start goaccess.js
pm2 start apinode/api.js
pm2 start apinode/api2.js
pm2 start apinode/api3.js
pm2 start goaccess.sh
