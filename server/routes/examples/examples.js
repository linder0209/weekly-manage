'use strict';

var express = require('express');
var Router = express.Router;
var router = new Router();

router.get('/', function (req, res) {
  res.render('examples/examples', {title: '例子'});
});


/**
 * 例子路由
 * @module examples
 * */
module.exports = router;
