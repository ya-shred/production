#Shred - чат для разработчиков

[![Build Status](https://travis-ci.org/ya-shred/production.svg?branch=master)](https://travis-ci.org/ya-shred/production)

## Настройка и запуск
В системе должны быть установлены
- mongodb - должна быть запущена
- npm

### Сборка
- ``npm i``

### Запуск
- дев сборка ``npm run dev``
- прод сборка ``npm run prod``

###Запуск тестов
- npm test
- для дебага тестов. Нужно поменять в karma.conf.js параметр singleRun на false

### Если хотите настроить прод сервер на digitalocean
####Развертка прод сервера
- сервер не ниже 1Gb ram
- Distributions: ubuntu 14.04
- Applications: node v4.1.0 on 14.04
- ставим галочку 'User Data' и туда вставляем содержимое файла cloud-init
- добавляем ssh ключи
- запускаем создание droplet
- после создания нужно поменять адрес webhook в проекте https://github.com/ya-shred/production/settings/hooks/6036173
- поменять адреса callback при гит авторизации https://github.com/organizations/ya-shred/settings/applications/250785

####Деплой на прод сервер:
- подключить репозиторий git remote add live ssh://root@IP/root/shri/production.git
- деплой git push live master
- сервер поднимится не сразу. Он сначала должен собраться

###Для деплоя на heroku
- git remote add heroku https://git.heroku.com/shri-andrey.git
- git push heroku master

###Для создания собственного сервера heroku
 - установить в heroku все переменные среды из config/production
 - установить несоклько билдпаков:
   - ``heroku buildpacks:set https://github.com/ddollar/heroku-buildpack-multi``
