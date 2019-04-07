module.exports = (sequelize, types) => {
  return sequelize.define("folder", {
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
    description: {
      type: types.STRING
    },
    type: {
      type: types.ENUM("l1", "l2", "l3", "l4", "l5", "undefined")
    }
  });
};
