const { Test, Question, Solution } = require("./config");
const questionController = require("./question");

const Controller = {
  create: ({ name, isQuiz = false, active = false }) => {
    return Test.create({
      name,
      active,
      isQuiz
    });
  },

  get: testId => {
    return Test.find({
      where: {
        id: testId
      },
      include: [{ model: Question }]
    });
  },
  setQuestions: (questionIds, testId) => {
    return new Promise((resolve, reject) => {
      Controller.get(testId)
        .then(async test => {
          await test.setQuestions(questionIds);
          resolve("Set tests questions");
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  removeTest: testId => {
    return Test.destroy({
      where: {
        id: testId
      }
    });
  },
  createSolution: (testId, solution, points, studentId) => {
    return Solution.create({ testId, solution, points, studentId });
  },
  solveTest: ({ testId, answers, studentId }) => {
    console.log(answers);
    return new Promise((resolve, reject) => {
      Controller.get(testId).then(test => {
        let points = 0;
        answers.forEach(answer => {
          console.log(answer);
          if (!answer) {
            return;
          }
          let questionId = Number(answer[0]);
          let answerIndex = Number(answer[1]);
          let question = test.questions.filter(
            question => question.id == questionId
          )[0];
          try {
            points += question.answers[answerIndex].isCorrect;
          } catch (err) {
            points += 0;
          }
        });
        console.log(points);
        Controller.createSolution(testId, answers, points, studentId)
          .then(data => {
            console.log(data);
            resolve(data);
          })
          .catch(err => {
            resolve(err);
          });
      });
    });
  },
  lock: testId => {
    return Test.update({ locked: true }, { where: { id: testId } });
  }
};

module.exports = Controller;
