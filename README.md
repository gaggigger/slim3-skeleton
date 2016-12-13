# slim3-skeleton

## Description

Single-page application skeleton built with Slim3 PHP framework as backend and AngularJS as frontend. 

## Installation and configuration

1. copy files to server and configure web server to serve /public folder. Web is Slim PHP site so configure web server accordingly (http://www.slimframework.com/docs/start/web-servers.html)
2. create and configure database (use SQL statements in /docs/sql.txt file)
3. configure application settings in /src/settings.php
4. create directory /logs and make sure it's writeable by web server
5. open web site and log in with: test / test123

## Requirements

PHP: >=5.5.9
MySQL: >=5.5.3

## Development

1. Backend
  * Slim3 - http://www.slimframework.com/
  * Eloquent ORM - https://laravel.com/docs/4.2/eloquent
2. Frontend
  * AngularJS 1.5.2
  * UIkit - http://getuikit.com/docs/core.html
  * Gulp 

Before changing frontend go to /public folder and install gulp and gulp modules:
```
cd public
npm install gulp-cli --global
npm install gulp --save-dev
npm install gulp-concat --save-dev
npm install gulp-uglify gulp-rename --save-dev
```