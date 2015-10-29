#!/bin/sh

echo client adding start

echo shri-andrey-performance-client-$1

npm i
rm -rf .git
git init
git add -A
git commit -m 'test'
heroku apps:destroy -a shri-andrey-p-client-$1 --confirm shri-andrey-p-client-$1
heroku apps:create shri-andrey-p-client-$1
heroku config:set NODE_ENV=test_client MANAGER_URI=http://`dig +short myip.opendns.com @resolver1.opendns.com`:6001
heroku config:set SERVER_URI=https://shri-andrey-performance-server.herokuapp.com CLIENT_NUMBER=$1

git push heroku master

#node index.js

echo client adding finish