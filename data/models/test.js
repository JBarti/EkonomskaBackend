module.exports = (sequelize, types) => {
  return sequelize.define("test", {
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
    locked: {
      type: types.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isQuiz: {
      type: types.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });
};
