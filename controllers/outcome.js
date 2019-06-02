const { Outcome } = require("./config");

const Controller = {
  types: [
    { name: "Hrana", locked: true },
    { name: "Režije", locked: true },
    { name: "Potrepštine", locked: false },
    { name: "Zabava", locked: false },
    { name: "Higijena", locked: true },
    { name: "Kava", locked: false },
    { name: "Prijevoz", locked: false },
    { name: "Neočekivano", locked: true },
    { name: "Kredit", locked: true }
  ],
  create: ({ amount, type, year, change = null, duration = null }) => {
    return Outcome.create({ amount, type, change, year, duration });
  },

  get: id => {
    return Outcome.find({ where: { id: id } });
  },

  changeAmount: async outcomes => {
    outcomes.forEach(async outcome => {
      let { change, id } = outcome;
      await Outcome.update({ change }, { where: { id } });
    });
  }
};

module.exports = Controller;
