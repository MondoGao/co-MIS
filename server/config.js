const R = require("ramda");

const host = R.defaultTo("localhost", process.env.MONGO_HOST);

const db = {
  admin: {
    user: "root",
    pass: "pwdMis"
  },
  app: {
    user: "mondo",
    pass: "misMondo"
  }
};

module.exports = {
  host,
  db
};
