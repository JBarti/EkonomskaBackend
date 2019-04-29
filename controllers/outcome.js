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
    "Kredit",
    "Neočekivano"
  ],
  create: ({ amount, type, change = null }) => {
    return Outcome.create({ amount, type, change });
  },

  get: id => {
    return Outcome.find({ where: { id: id } });
  }
};

module.exports = Controller;
