const {
  User,
  Tracker,
  SportRecord,
  SpaceType,
  Space,
  EquipmentType,
  Equipment,
} = require('../models');
const logger = require('../logger');

async function seedModels(Model, insArr = [], name = 'Entity') {
  if (insArr.length <= 0) {
    return;
  }

  const flag = await Model.findOne(insArr[0]);
  if (flag != null) {
    return flag;
  }
  console.log(flag, name, insArr[0]);

  logger.info(`Seeding ${name}`);

  const models = await Model.create(insArr);

  return models[0];
}

async function seed() {
  const user = await seedModels(
    User,
    [
      {
        name: 'Mondo',
        rfid: '000000000000000000000091',
        type: 1,
      },
    ],
    'user',
  );

  const tracker = await seedModels(
    Tracker,
    [
      {
        rfid: '000000000000000000000090',
        channel: '10295',
      },
    ],
    'tracker',
  );

  await seedModels(
    SportRecord,
    [
      {
        user: user.id,
        tracker: tracker.id,
        startTime: 1528881188952,
        endTime: 1528881188952 + 100,
        path: [
          {
            x: 1,
            y: 1,
          },
          {
            x: 20,
            y: 20,
          },
        ],
      },
    ],
    'sportRecord',
  );

  const spaceType = await seedModels(
    SpaceType,
    [
      {
        name: '太空运动场',
      },
    ],
    'spaceType',
  );

  const space = await seedModels(
    Space,
    [
      {
        name: '火星',
        type: spaceType.id,
        isAvaliable: true,
        avaliableDuration: {
          start: {
            hour: 6,
            minute: 30,
          },
          end: {
            hour: 22,
            minute: 0,
          },
        },
      },
    ],
    'space',
  );

  const equipType = await seedModels(
    EquipmentType,
    [
      {
        name: '激光剑',
      },
      {
        name: '宇宙宝右',
      },
    ],
    'equipType',
  );

  const equip = await seedModels(
    Equipment,
    [
      {
        name: '地球出品',
        type: equipType.id,
        rfid: '000000000000000000000093',
        isAvaliable: true,
        avaliableDuration: {
          start: {
            hour: 0,
            minute: 30,
          },
          end: {
            hour: 23,
            minute: 30,
          },
        },
      },
    ],
    'equip',
  );

  logger.info('Seeding finished');
}

module.exports = {
  seed,
};
