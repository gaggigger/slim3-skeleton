# slim3-skeleton

## Description


## Installation and configuration

1. copy files to server and configure web server to serve /public folder. Web is Slim PHP site so configure web server accordingly (http://www.slimframework.com/docs/start/web-servers.html)
2. create and configure database (use SQL statements in /docs/sql.txt file)
3. configure application settings in /src/settings.php

## Development

Backend is Slim3 PHP framework and frontend is AngularJS based web.
Before changing frontend go to /public folder and install gulp and gulp modules:

```
cd public
npm install gulp-cli --global
npm install gulp --save-dev
npm install gulp-concat --save-dev
npm install gulp-uglify gulp-rename --save-dev
```