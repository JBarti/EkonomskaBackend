const { Outcome } = require("./config");

const Controller = {
  types: [
    "Hrana",
    "Režije",
    "Potrepštine",
    "Zabava",
    "Higijena",
    "Kava",
    "Prijevoz",
    "Neočekivano",
    "Kredit"
  ],
  create: ({ amount, type, year, change = null }) => {
    return Outcome.create({ amount, type, change, year });
  },

  get: id => {
    return Outcome.find({ where: { id: id } });
  }
};

module.exports = Controller;
