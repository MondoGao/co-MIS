const fs = require('fs');
const { resolve } = require('path');
const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers');

const schema = fs.readFileSync(resolve(__dirname, 'schema.gql'), {
  encoding: 'utf8',
});

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});
