# Инструкции

Сюда размещаем различные инструкции по сборке и развертыванию приложения. А так же различные гайды.

## Использование языков

Язык комментариев, инструкций, задач, коммитов - русский.
Название веток - английский.

## Code style

https://github.com/yandex/codestyle/blob/master/javascript.ru.md

## Стараемся комментировать свой код

## Работа с git

Каждую задачу делаем на свое ветке. Ветка именуется: `(номер задачи)_краткое-описание`, например `2_add-new-message-api`

Каждый коммит начинается с #номер задачи, например #4 - коммит по 4 задаче. Когда заканчиваем задачу, последний коммит должен быть close #4

## Настройка и запуск
В системе должны быть установлены
- mongodb - должна быть запущена
- npm

Сборка
- npm i

Запуск
- дев сборка ``npm run dev``
- прод сборка ``npm run prod``