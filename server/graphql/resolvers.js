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

const resolvers = {
  Date: GraphQLDateTime,
  Query: {
    users: () => User.find(),
    trackers: () => Tracker.find(),
    sportRecords: () => SportRecord.find(),
    spaceTypes: () => SpaceType.find(),
    spaces: () => Space.find(),
    equipmentTypes: () => EquipmentType.find(),
    equipments: () => Equipment.find(),
    reservations: () => Reservation.find(),
  },
  User: {},
  Tracker: {},
  Resource: {
    __resolveType(obj) {
      return obj.__t;
    },
    type: obj => ResourceType.findById(obj.type),
  },
  ResourceType: {
    __resolveType(obj) {
      return obj.__t;
    },
  },
  SpaceType: {},
  EquipmentType: {},
  SportRecord: {
    user(obj) {
      return User.findById(obj.user);
    },
    tracker(obj) {
      return Tracker.findById(obj.tracker);
    },
  },
  Space: {},
  Equipment: {},
  Reservation: {
    user: obj => User.findById(obj.user),
    resource: obj => Resource.findById(obj.resouce),
  },
};

module.exports = resolvers;
