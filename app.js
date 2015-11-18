'use strict';

/**
 * 依赖模块
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var routes = require('./server/routes/routes');

var app = express();

//开发环境
var environment = 'development';
app.set('env', environment);

// view engine setup
//让ejs模板改为扩展名为html
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var rootPath = path.join(__dirname, app.get('env') === 'development' ? 'app' : 'webapp');
app.use(favicon(rootPath + '/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser({limit: '10mb'}));//设置前端post提交最大内容
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//定义路由
routes(app);

// development only
if (app.get('env') === 'development') {
  app.set('views', path.join(__dirname, 'app'));
  app.use(express.static(path.join(__dirname, 'app')));
} else {
  app.set('views', path.join(__dirname, 'webapp'));
  app.use(express.static(path.join(__dirname, 'webapp')));
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('errors/404');
});

// error handlers
// development error handler
// will print stacktrace
var errorCode = 500;
app.use(function (err, req, res, next) {
  res.status(err.status || errorCode);
  res.render('errors/error', {
    message: err.message,
    error: err
  });
});

module.exports = app;
