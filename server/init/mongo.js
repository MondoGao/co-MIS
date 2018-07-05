const mongoose = require('mongoose');

const logger = require('../logger');
const config = require('../config');
const delay = require('../helpers/delay');
const { seed } = require('./seeds');

const { host, db } = config;

logger.info('Config', config);

let canConnect = false;

async function initDbUser() {
  if (canConnect) {
    return;
  }

  try {
    const { connection: conn } = await mongoose.connect(
      `mongodb://${host}/admin`,
      db.admin,
    );
    canConnect = true;

    logger.info('Mongodb is started');
    // Try to create default user if we cann't connect.

    const sportsDb = conn.client.db('sports');

    await sportsDb.addUser(db.app.user, db.app.pass, {
      roles: [{ role: 'readWrite', db: 'sports' }],
    });
  } catch (e) {
    throw e;
  } finally {
    await mongoose.disconnect();
  }
}

async function initDbConnection({ maxTryCount = 4 } = {}) {
  try {
    logger.info(`${count}th try to connect`);
    await initDbUser();
  } catch (e) {
    await delay(2000);
  }

  await mongoose.connect(
    `mongodb://${host}/sports`,
    db.app,
  );

  logger.info('Success connected to mongo with mondo in sports');

  await seed();
}

module.exports = {
  initDbConnection,
};
