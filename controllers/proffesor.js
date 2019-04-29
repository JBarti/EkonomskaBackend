const {
  Proffesor,
  Student,
  Test,
  File,
  Grade,
  Question,
  Folder,
  Notification,
  Solution,
  Income,
  Outcome
} = require("./config");
const StudentController = require("./student");
const logger = require("../logger");
const { sequelize } = require("./config");

const Controller = {
  create: ({ firstName, lastName, email, password }) => {
    return Proffesor.create({
      firstName,
      lastName,
      email,
      password
    });
  },

  get: (email, password) => {
    console.log(
      `Test get: \nentered email: ${email} \nentered password: ${password}`
    );
    return new Promise((res, rej) => {
      Proffesor.find({
        attributes: ["id", "firstName", "lastName", "email", "notifications"],
        include: [
          {
            model: Grade,
            include: [
              {
                model: Student,
                include: [Solution, Income, Outcome]
              },
              { model: Notification },
              {
                model: Folder,
                include: [File, { model: Test, include: [Question] }]
              }
            ]
          }
        ],
        where: {
          email: email,
          password: password
        }
      }).then(async data => {
        try {
          var proffesor = data.get({ plain: true });
        } catch (err) {
          res(undefined);
        }
        for (let grade in proffesor.grades) {
          console.log("GREJD");
          for (let student in grade.students) {
            console.log(student.id);
            student.solutions = await StudentController.getSolutions(
              student.id
            );
            logger.logData(student.solutions);
          }
        }
        logger.logData(data);
        res(data);
      });
    });
  },

  getById: proffesorId => {
    return new Promise((res, rej) => {
      Proffesor.find({
        attributes: ["id", "firstName", "lastName", "email", "notifications"],
        include: [
          {
            model: Grade,
            include: [
              {
                model: Student,
                include: []
              },
              { model: Notification },
              {
                model: Folder,
                include: [File, { model: Test, include: [Question] }]
              }
            ]
          }
        ],
        where: {
          id: proffesorId
        }
      }).then(async data => {
        let proffesor = data.get({ plain: true });
        for (let gradeIndex in proffesor.grades) {
          let grade = proffesor.grades[gradeIndex];
          for (let studentIndex in grade.students) {
            let student = grade.students[studentIndex];
            student.solutions = await StudentController.getSolutions(
              student.id
            );
            logger.logData(student.solutions);
          }
        }
        logger.logData(data);
        res(data);
      });
    });
  },
  addGrade: (proffesorId, gradeId) => {
    return new Promise((resolve, reject) => {
      Controller.getById(proffesorId)
        .then(proffesor => {
          proffesor.addGrade(gradeId);
          resolve("added grade to proffesor");
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

module.exports = Controller;
