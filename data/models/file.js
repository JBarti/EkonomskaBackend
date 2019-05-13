module.exports = (sequelize, types) => {
  return sequelize.define("file", {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: types.STRING,
      allowNull: false
    },
    url: {
      type: types.STRING,
      allowNull: false,
      validate: { isUrl: true }
    }
  });
};
