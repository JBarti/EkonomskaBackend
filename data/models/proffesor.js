module.exports = (sequelize, types) => {
  return sequelize.define("proffesor", {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    firstName: {
      type: types.STRING,
      allowNull: false
    },
    lastName: {
      type: types.STRING,
      allowNull: false
    },
    email: {
      type: types.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: types.STRING,
      allowNull: false
    },
    notifications: {
      type: types.ARRAY(types.JSON)
    }
  });
};
