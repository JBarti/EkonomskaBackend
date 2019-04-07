const {
  Grade,
  Student,
  Finance,
  Test,
  Folder,
  File,
  Question
} = require("./config");
const studentController = require("./student");
const testController = require("./test");
const logger = require("../logger");

const Controller = {
  create: ({ name, description, type }) => {
    return Folder.create({ name, description, type });
  },
  get: folderId => {
    return Folder.find({
      where: { id: folderId },
      include: [{ model: Test, include: [Question] }, { model: File }]
    });
  },
  addTest: (testId, folderId) => {
    return new Promise((resolve, reject) => {
      Controller.get(folderId)
        .then(folder => {
          folder.addTest(testId);
          resolve("added test to folder");
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  addFile: (fileId, folderId) => {
    return new Promise((resolve, reject) => {
      Controller.get(folderId)
        .then(folder => {
          folder.addFile(fileId);
          resolve("added file to folder");
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  changeName: (folderId, name) => {
    return Folder.update({ name }, { where: { id: folderId } });
  }
};

module.exports = Controller;
