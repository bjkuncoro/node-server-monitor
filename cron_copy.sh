#!/bin/bash
# A sample Bash script, by Ryan
echo Hello World!
cp -u public/laporan.json monitor/log/goaccess-log.$(date +%F_%R).json
echo Sudah lelah !!
