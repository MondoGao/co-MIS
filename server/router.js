const KoaRouter = require('koa-router');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const graphql = require('./graphql');
const { User } = require('./models');

const router = new KoaRouter();

router.get('/', (ctx, next) => {
  ctx.body = 'hello koa';
  next();
});

router.post('/login', async (ctx, next) => {
  const { body } = ctx.request;
  const user = await User.findOne({
    rfid: body.rfid,
  }).lean();

  if (!user) {
    ctx.throw(401, 'user not found', body);
    next();
    return;
  }

  ctx.cookies.set('id', user._id);

  ctx.body = {
    data: user,
  };
  next();
});

router.all('/graphql', graphqlKoa({ schema: graphql }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

module.exports = router;
