const { Test, Question, Solution } = require("./config");
const questionController = require("./question");

const Controller = {
  create: ({ name, testId, active = false }) => {
    return Test.create({
      name,
      active,
      testId
    });
  },

  get: testId => {
    return Test.find({
      where: {
        id: testId
      },
      include: [Question]
    });
  },
  setQuestions: (questionIds, testId) => {
    return new Promise((resolve, reject) => {
      Controller.get(testId)
        .then(test => {
          test.setQuestions(questionIds);
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
          points += question.answers[answerIndex].isCorrect;
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
  }
};

module.exports = Controller;
