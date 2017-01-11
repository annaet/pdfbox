module.exports = function (app) {
  'use strict';

  app.use('/pdf', require('./pdf'));
};
