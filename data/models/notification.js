module.exports = (sequelize, types) => {
  return sequelize.define("notifications", {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: types.STRING,
      allowNull: false
    },
    description: {
      type: types.STRING
    },
  });
};
