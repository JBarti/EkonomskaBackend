module.exports = (sequelize, types) => {
  return sequelize.define("income", {
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
    amount: {
      type: types.INTEGER,
      allowNull: false
    },
    type: {
      type: types.ENUM("job", "fee", "saving"),
      allowNull: false
    },
    year: {
      type: types.INTEGER,
      allowNull: false
    }
  });
};
