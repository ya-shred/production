#!/bin/sh

echo client adding start

npm i
rm -rf .git
git init
git add -A
git commit -m 'test'
#heroku apps:destroy -a shri-andrey-performance-server --confirm shri-andrey-performance-server
#heroku apps:create shri-andrey-performance-server
#heroku config:set NODE_ENV=TEST_SERVER SERVER_URI=`dig +short myip.opendns.com @resolver1.opendns.com`

#git push heroku master

node index.js

echo client adding finish