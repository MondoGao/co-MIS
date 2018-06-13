const Koa = require('koa');
const koaLogger = require('koa-logger');

const router = require('./router');

const { initDbConnection } = require('./init/mongo');

async function start() {
  await initDbConnection();

  const app = new Koa();

  app
    .use(koaLogger())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);
}

start();
