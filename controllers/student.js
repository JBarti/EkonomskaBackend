const {
  Grade,
  Student,
  Finance,
  File,
  Test,
  Folder,
  Question,
  Solution,
  Outcome,
  Income,
  Notification
} = require("./config");
const logger = require("../logger");
const { sequelize } = require("./config");
const Op = sequelize.Op;

const Controller = {
  create: ({ firstName, lastName, email, password }) => {
    return Student.create({
      firstName,
      lastName,
      email,
      password
    });
  },

  get: (email, password) => {
      return Student.find({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "gradeId"
        ],
        include: [
          { model: Outcome },
          { model: Income },
          { model: Solution },
          {
            model: Grade,
            include: [
              {
                model: Folder,
                include: [{ model: Test, include: [Question] }, { model: File }]
              },
              {model: Notification}
            ]
          }
        ],
        where: {
          email: email,
          password: password
        }
    });
  },

  getById: id => {
    return Student.find({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "gradeId"
      ],
      include: [
          { model: Outcome },
          { model: Income },
          { model: Solution },
          {
            model: Grade,
            include: [
              {
                model: Folder,
                include: [{ model: Test, include: [Question] }, { model: File }]
              },
              {model: Notification}
            ]
          }
        ],
      where: {
        id: id
      }
    });
  },

  getByIdSecond: id => {
    return Student.find({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "gradeId"
      ],
      where: { id: id }
    });
  },

  getSolutions: studentId => {
    return Solution.findAll({ where: { studentId } });
  },
  checkExistance: email => {
    return Student.count({
      where: {
        email: email
      }
    });
  },
  getGradeSolutions: studentIds => {
    return Solution.findAll({ where: { studentId: { [Op.in]: studentIds } } });
  },
  addIncome: (studentId, incomeId) => {
    logger.logError(studentId);
    logger.logData(incomeId);
    return new Promise((resolve, reject) => {
      Controller.getByIdSecond(studentId)
        .then(student => {
          student.addIncome(incomeId);
          resolve("added income to student");
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  addOutcome: (studentId, outcomeId) => {
    logger.logError(studentId);
    logger.logData(outcomeId);
    return new Promise((resolve, reject) => {
      Controller.getByIdSecond(studentId)
        .then(student => {
          student.addOutcome(outcomeId);
          resolve("added outcome to student");
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  updateCredentials: (id, firstName, lastName, email, password) => {
    return Student.update(
      {
        firstName,
        lastName,
        email,
        password
      },
      { where: { id: id } }
    );
  },

  remove: studentId => {
    return Student.destroy({
      where: { id: studentId }
    });
  },

  solveTest: ({ studentId, testId, solution, testPoints, studentsPoints }) => {
    return new Promise((resolve, reject) => {
      Controller.getByIdSecond(studentId)
        .then(data => {
          Solution.create({
            solution,
            testId,
            testPoints,
            studentsPoints
          }).then(solution => {
            data.student.addSolution(solution);
            resolve("added finance to student");
          });
        })
        .catch(err => {
          reject(err);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

module.exports = Controller;
