const { GraphQLDateTime } = require('graphql-iso-date');
const { User, Tracker, SportRecord } = require('../models');

const resolvers = {
  Query: {
    users: () => User.find(),
    trackers: () => Tracker.find(),
    sportRecords: () => SportRecord.find(),
  },
  User: {},
  Tracker: {},
  SportRecord: {
    user(obj) {
      return User.findById(obj.user);
    },
    tracker(obj) {
      return Tracker.findById(obj.tracker);
    },
  },
  Date: GraphQLDateTime,
};

module.exports = resolvers;
