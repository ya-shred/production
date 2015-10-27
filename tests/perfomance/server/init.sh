#!/bin/sh

echo server restarting start

# remove previous server sources
rm -rf app
# copy updated sources
rsync -a ../../../ ./app/ --exclude tests
rm -rf app/config
rsync -a config ./app/
cp ./server.js app/server.js

cd app
rm -rf .git
git submodule add -f `pwd`
git add -A
git commit -m 'test'
#heroku apps:destroy -a shri-andrey-performance-server --confirm shri-andrey-performance-server
#heroku apps:create shri-andrey-performance-server
#heroku config:set NODE_ENV=TEST_SERVER SERVER_URI=`dig +short myip.opendns.com @resolver1.opendns.com`

#git push heroku master

echo server restarting finish