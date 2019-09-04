module.exports = (sequelize, types) => {
  return sequelize.define("outcomes", {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    amount: {
      type: types.INTEGER,
      allowNull: false
    },
    change: {
      type: types.INTEGER,
      allowNull: true
    },
    type: {
      type: types.ENUM(
        "Hrana",
        "Režije",
        "Potrepštine",
        "Zabava",
        "Higijena",
        "Kava",
        "Prijevoz",
        "Kredit",
        "Neočekivano"
      ),
      allowNull: false
    },
    year: {
      type: types.INTEGER,
      allowNull: false
    },
    duration: {
      type: types.INTEGER,
      allowNull: true
    }
  });
};
