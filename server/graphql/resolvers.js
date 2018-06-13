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

const entitiesResolverCreator = Entity => (obj, { query = {} }) => {
  if (query.id) {
    return [Entity.findById(query.id)];
  }

  return Entity.find(query);
};

const updateMutationCreator = Entity => async (obj, { data = {} }) => {
  if (!data.id) {
    return Entity.create(data);
  }

  const record = await Entity.findById(data.id);

  for (const [key, value] of Object.entries(data)) {
    record[key] = value;
  }

  await record.save();

  return record;
};

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
  Mutation: {
    updateUser: updateMutationCreator(User),
    updateTracker: updateMutationCreator(Tracker),
    updateSportRecord: updateMutationCreator(SportRecord),
    updateSpaceType: updateMutationCreator(SpaceType),
    updateEquipmentType: updateMutationCreator(EquipmentType),
    updateSpace: updateMutationCreator(Space),
    updateEquipment: updateMutationCreator(Equipment),
    updateReservation: updateMutationCreator(Reservation),
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
