const { GraphQLDateTime } = require('graphql-iso-date');
const {
  User,
  Tracker,
  SportRecord,
  Resource,
  ResourceType,
  SpaceType,
  Space,
  EquipmentType,
  Equipment,
  Reservation,
} = require('../models');

const entitiesResolverCreator = Entity => (obj, args) =>
  Entity.find(args.query);

const resolvers = {
  Date: GraphQLDateTime,
  Query: {
    users: entitiesResolverCreator(User),
    trackers: entitiesResolverCreator(Tracker),
    sportRecords: entitiesResolverCreator(SportRecord),
    spaceTypes: entitiesResolverCreator(SpaceType),
    spaces: entitiesResolverCreator(Space),
    equipmentTypes: entitiesResolverCreator(EquipmentType),
    equipments: entitiesResolverCreator(Equipment),
    reservations: entitiesResolverCreator(Reservation),
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
  ResourceType: {
    async __resolveType(id) {
      const obj = await ResourceType.findById(id);
      return obj.__t;
    },
  },
  Resource: {
    async __resolveType(id) {
      const obj = await Resource.findById(id);
      return obj.__t;
    },
  },
  SpaceType: {},
  EquipmentType: {},
  Space: {
    type: obj => ResourceType.findById(obj.type),
  },
  Equipment: {
    type: obj => ResourceType.findById(obj.type),
  },
  Reservation: {
    user: obj => User.findById(obj.user),
    resource: obj => Resource.findById(obj.resouce),
  },
};

module.exports = resolvers;
