'use strict';

var express = require('express');
var Router = express.Router;
var router = new Router();

router.get('/', function (req, res) {
  res.render('index', {
    title: '周报管理系统'
  });
});

module.exports = router;
