module.exports = (sequelize, types) => {
  return sequelize.define("solution", {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    solution: {
      type: types.ARRAY(types.TEXT),
      allowNull: false
    },
    testId: {
      type: types.INTEGER,
      allowNull: false
    },
    studentId: {
      type: types.INTEGER,
      references: { model: "students", referencesKey: "id" },
      allowNull: false
    },
    points: {
      type: types.INTEGER,
      allowNull: false
    }
  });
};
