const { DataTypes } = require("sequelize");
const { db } = require("./db");

const Session = db.define(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teamId: {
      type: DataTypes.INTEGER,
      field: "team_id",
    },
    creatorId: {
      type: DataTypes.INTEGER,
      field: "user_id",
    },
    setlistId: {
      type: DataTypes.INTEGER,
      field: "setlist_id",
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  { tableName: "sessions" }
);

async function find(sessionId) {
  let session = await Session.findByPk(sessionId);
  return session?.toJSON();
}

async function update(sessionId, updates) {
  await Session.update(updates, { where: { id: sessionId } });
}

module.exports = {
  find,
  update,
};
