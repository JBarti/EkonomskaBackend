const { Income } = require("./config");

const Controller = {
  types: ["job", "fee"],
  create: ({ name, amount, type }) => {
    return Income.create({ name, amount, type });
  },

  get: id => {
    return Income.find({ where: { id: id } });
  }
};

module.exports = Controller;
