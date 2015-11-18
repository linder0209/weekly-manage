'use strict';

var main = require('./main');
var examples = require('./examples/examples');
var weekly = require('./weekly-manage/weekly');

module.exports = function (app) {
  app.use('/', main);
  app.use('/examples', examples);
  app.use('/weekly', weekly);
};
