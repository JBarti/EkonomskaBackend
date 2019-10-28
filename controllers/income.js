const { Income } = require("./config");

const Controller = {
  types: ["job", "fee", "saving"],
  create: ({ name, amount, type, year }) => {
    return Income.create({ name, amount, type, year });
  },

  get: id => {
    return Income.find({ where: { id: id } });
  }
};

module.exports = Controller;
