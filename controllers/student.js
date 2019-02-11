const {
  Grade,
  Student,
  Finance,
  File,
  Test,
  Folder,
  Question,
  Solution
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

  get: (email, password, logingIn = true) => {
    return new Promise((resolve, reject) => {
      Student.find({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "notifications",
          "active",
          "gradeId"
        ],
        include: [
          {
            model: Grade,
            include: [
              {
                model: Folder,
                include: [{ model: Test, include: [Question] }, { model: File }]
              }
            ]
          }
        ],
        where: {
          email: email,
          password: password
        }
      }).then(student => {
        Controller.getSolutions(student.id).then(solutions => {
          student = student.get({ plain: true });
          console.log("\n\n");
          console.log(solutions);
          console.log("\n\n");
          student.solutions = solutions;
          resolve(student);
        });
      });
    });
  },
  getById: id => {
    return Student.find({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "notifications",
        "active",
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
  addNotification: (id, { from, description, text, important }) => {
    return Student.update(
      {
        notifications: sequelize.fn(
          "array_append",
          sequelize.col("notifications"),
          JSON.stringify({
            from,
            description,
            text,
            important
          })
        )
      },
      {
        where: {
          id: id
        }
      }
    );
  },
  addFinance: (studentId, financeId) => {
    logger.logError(studentId);
    return new Promise((resolve, reject) => {
      Controller.getById(studentId)
        .then(student => {
          student.addFinance(financeId);
          resolve("added finance to student");
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  makeInactive: (id, email) => {
    return Student.update(
      {
        active: false
      },
      {
        where: {
          email: email,
          id: id
        }
      }
    );
  },
  solveTest: ({ studentId, testId, solution, testPoints, studentsPoints }) => {
    return new Promise((resolve, reject) => {
      Controller.getById(studentId)
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
