const {
  Proffesor,
  Student,
  Test,
  File,
  Grade,
  Question,
  Folder,
  Notification
} = require("./config");
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
    return Proffesor.find({
      attributes: ["id", "firstName", "lastName", "email", "notifications"],
      include: [
        {
          model: Grade,
          include: [
            {
              model: Student
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
    });
  },

  getById: proffesorId => {
    return Proffesor.find({
      attributes: ["id", "firstName", "lastName", "email", "notifications"],
      include: [
        {
          model: Grade,
          include: [
            {
              model: Student
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
