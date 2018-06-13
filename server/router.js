const KoaRouter = require('koa-router');

  const router = new KoaRouter();

  router.get('/', (ctx, next) => {
    ctx.body = 'hello koa';
    next();
  });

module.exports = router;
