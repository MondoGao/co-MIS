const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaLogger = require('koa-logger');
const mongoose = require('mongoose');

const { initDbConnection } = require('./init/mongo');

async function start() {
  await initDbConnection();

  const Cat = mongoose.model('Cat', { name: String });

  const kitty = new Cat({ name: 'Zildjian' });
  kitty.save().then(() => console.log('meow'));

  const app = new Koa();
  const router = new KoaRouter();

  router.get('/', (ctx, next) => {
    ctx.body = 'hello koa!';
    next();
  });

  app
    .use(koaLogger())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);
}
console.log('??????');

start();
