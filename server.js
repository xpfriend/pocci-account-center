'use strict';
var koa = require('koa');

var logger = require('koa-logger');
var serve = require('koa-static');
var router = require('koa-router')();
var user = require('./controllers/user');
var bodyParser = require('koa-body-parser');

var app = module.exports = koa();

router
  .post('/search', user.search)
  .post('/login', user.login)
  .post('/save', user.save)
  .post('/del', user.del);

app
  .use(logger())
  .use(bodyParser())
  .use(serve('public'))
  .use(router.routes())
  .use(router.allowedMethods());

if (!module.parent) {
  app.listen(process.env.USER_APP_PORT || 80);
}
