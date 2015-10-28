#!/bin/sh

echo server restarting start

# remove previous server sources
rm -rf app
# copy updated sources
rsync -a ../../../ ./app/ --exclude tests
cp -R ./replace/ ./app/

cd app
rm -rf .git
git init
git add -A
git commit -m 'test'
heroku apps:destroy -a shri-andrey-performance-server --confirm shri-andrey-performance-server
heroku apps:create shri-andrey-performance-server
heroku config:set NODE_ENV=TEST_SERVER MANAGER_URI=`dig +short myip.opendns.com @resolver1.opendns.com`

git push heroku master

#node server.js

echo server restarting finish