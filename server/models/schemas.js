const mongoose = require('mongoose');

const { Schema } = mongoose;

const trackerSchema = new Schema(
  {
    rfid: String,
    channel: String,
  },
  {
    timestamps: true,
  },
);

const userSchema = new Schema(
  {
    rfid: String,
    name: String,
    type: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const sportRecordSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    tracker: {
      type: Schema.Types.ObjectId,
      ref: 'Tracker',
      require: true,
    },
    space: {
      type: Schema.Types.ObjectId,
      ref: 'Space',
    },
    startTime: {
      type: Date,
      default: Date.now,
      require: true,
    },
    endTime: Date,
    path: [
      {
        x: Number,
        y: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const resourceTypeSchema = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  },
);

const reservationSchema = new Schema(
  {
    startTime: Date,
    endTime: Date,
    isActived: Boolean,
    isClosed: Boolean,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    resource: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
    },
  },
  {
    timestamps: true,
  },
);

const resourceSchema = new Schema(
  {
    name: String,
    type: {
      type: Schema.Types.ObjectId,
      ref: 'ResourceType',
    },
    isAvaliable: {
      type: Boolean,
      default: true,
    },
    rfid: String,
    avaliableDuration: {
      start: {
        hour: {
          type: Number,
          default: 6,
        },
        minute: {
          type: Number,
          default: 0,
        },
      },
      end: {
        hour: {
          type: Number,
          default: 22,
        },
        minute: {
          type: Number,
          default: 0,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = {
  userSchema,
  trackerSchema,
  sportRecordSchema,
  resourceTypeSchema,
  reservationSchema,
  resourceSchema,
};
