#!/bin/sh

echo client adding start

echo shri-andrey-performance-client-$1

npm i
rm -rf .git
git init
git add -A
git commit -m 'test'
heroku apps:destroy -a shri-andrey-performance-client-$1 --confirm shri-andrey-performance-client-$1
heroku apps:create shri-andrey-performance-client-$1
heroku config:set NODE_ENV=TEST_CLIENT MANAGER_URI=`dig +short myip.opendns.com @resolver1.opendns.com`
heroku config:set SERVER_URI=https://shri-andrey-performance-server.herokuapp.com

git push heroku master

#node index.js

echo client adding finish