const KoaRouter = require('koa-router');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const graphql = require('./graphql');

const router = new KoaRouter();

router.get('/', (ctx, next) => {
  ctx.body = 'hello koa';
  next();
});

router.all('/graphql', graphqlKoa({ schema: graphql }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

module.exports = router;
