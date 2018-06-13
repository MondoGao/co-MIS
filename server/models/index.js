const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const schemas = require('./schemas');

const model = mongoose.model.bind(mongoose);

const User = model('User', schemas.userSchema);
const Tracker = model('Tracker', schemas.trackerSchema);
const SportRecord = model('SportRecord', schemas.sportRecordSchema);
const Reservation = model('Reservation', schemas.reservationSchema);

const ResourceType = model('ResourceType', schemas.resourceTypeSchema);
const SpaceType = ResourceType.discriminator('SpaceType', new Schema({}));
const EquipmentType = ResourceType.discriminator(
  'EquipmentType',
  new Schema({}),
);

const Resource = model('Resource', schemas.resourceSchema);
const Space = Resource.discriminator(
  'Space',
  new Schema({
    type: {
      type: Schema.Types.ObjectId,
      ref: 'SpaceType',
    },
  }),
);
const Equipment = Resource.discriminator(
  'Equipment',
  new Schema({
    type: {
      type: Schema.Types.ObjectId,
      ref: 'EquipmentType',
    },
  }),
);

module.exports = {
  User,
  Tracker,
  SportRecord,
  Reservation,
  SpaceType,
  EquipmentType,
  Space,
  Equipment,
};
