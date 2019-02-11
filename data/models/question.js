module.exports = (sequelize, types) => {
  return sequelize.define("question", {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    text: {
      type: types.STRING,
      allowNull: false
    },
    answers: {
      type: types.ARRAY(types.JSON),
      set(answers) {
        answers.forEach(answer => {
          if (!("answer" in answer && "isCorrect" in answer))
            throw new Error('Invalid "answer" object parameters');
          this.setDataValue("answers", answers);
        });
      }
    }
  });
};
