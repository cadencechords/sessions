const { Sequelize } = require("sequelize");
console.log(process.env.DATABASE_URL);
const db = new Sequelize(process.env.DATABASE_URL);
const pg = require("pg");

pg.types.setTypeParser(20, function (value) {
  return parseInt(value);
});

async function testConnection() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = {
  testConnection,
  db,
};
