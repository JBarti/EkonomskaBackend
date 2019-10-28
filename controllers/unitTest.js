const logger = require("../logger");
const studentController = require("./student");
const gradeController = require("./grade");
const testController = require("./test");
const questionController = require("./question");
const fileController = require("./file");
const proffesorController = require("./proffesor");
const folderController = require("./folder");
const notificationController = require("./notification");
const incomeController = require("./income");
const outcomeController = require("./outcome");
const { Student, Folder, Notification } = require("./config");

module.exports = async () => {
  const testUser = {
    firstName: "test",
    lastName: "test",
    email: "testtest",
    password: "test"
  };

  logger.logTest("Test create student");
  let student = await studentController.create(testUser);
  logger.logData(student);


  logger.logTest("Test createRazred");
  grade = await gradeController.create({
    name: "3D"
  });
  logger.logData(
    grade.get({
      plain: true
    })
  );

  logger.logTest("Test add notification");
  const notification = await notificationController.create({description: "DESCRIPTION", title: "TItle", important: false});
  await gradeController.addNotification(1, 1);

  logger.logTest("Test addUcenikToRazred");
  status = await gradeController.addStudent(1, 1);
  logger.logData(status);

  logger.logTest("Test getRazred");
  grade = await gradeController.get(1);
  logger.logData(
    grade.get({
      plain: true
    })
  );

  logger.logTest("Test get student");
  try {
    student = await studentController.get(
      "testtest",
      "test",
    );
  } catch (error) {
    logger.logError(error);
  }
  logger.logData(student);

  logger.logTest("Test check user existence");
  status = await studentController.checkExistance("testtest@gmail.com");
  logger.logMessage(`Email testtest@gmail.com exists: ${status}`);
  status = await studentController.checkExistance("invalidmail@gmail.com");
  logger.logMessage(`Email invalidmail@gmail.com exists: ${status}`);

  logger.logTest("Create folder");
  let folder = await folderController.create({
    name: "lekcija1",
    description: `
    Lorem ipsum dolor sit amet, 
    consectetur adipiscing elit, sed 
    doeiusmod tempor incididunt ut labore
    et dolore magna aliqua.`,
    type: "l1"
  });
  logger.logData(folder.get({ plain: true }));

  logger.logTest("Create test");
  let test = await testController.create({
    name: "testing test",
    active: true,
    isQuiz: true
  });
  logger.logData(
    test.get({
      plain: true
    })
  );

  logger.logTest("Create questions");
  let question = await questionController.create({
    text: "Who was Americas first president?",
    answers: [
      {
        answer: "Bill Clinton",
        isCorrect: false
      },
      {
        answer: "George Bush",
        isCorrect: true
      }
    ]
  });

  logger.logTest("Create questions");
  question = await questionController.create({
    text: "Who was Americas first president?",
    answers: [
      {
        answer: "Bill Clinton",
        isCorrect: false
      },
      {
        answer: "George Bush",
        isCorrect: true
      }
    ]
  });

  logger.logData(
    question.get({
      plain: true
    })
  );

  logger.logTest("Add question to test");
  status = await testController.setQuestions([1, 2], 1);

  // logger.logTest('Add test to grade')
  // status = await gradeController.addTest(1, 1)
  // logger.logMessage(status)

  logger.logTest("Create file");
  let file = await fileController.create({
    name: "test file",
    url:
      "https://www.rscautomobile.com/data/documents/cars/1511270057-naamloosdocument.pdf",
    type: "pdf",
    lesson: "1",
    active: true
  });
  logger.logData(
    file.get({
      plain: true
    })
  );

  // logger.logTest('Add file to grade')
  // status = await gradeController.addFile(1, 1)
  // logger.logMessage(status)

  logger.logTest("Get grade");
  grade = await gradeController.get(1, [Student, Folder]);
  logger.logData(
    grade.get({
      plain: true
    })
  );

  logger.logTest("Create Proffesor");
  // var proffesor = await proffesorController.create({
  //   firstName: "Anita",
  //   lastName: "Grgić",
  //   email: "profGrgić",
  //   password: "aGrgić"
  // });status

  // var proffesor = await proffesorController.create({
  //   firstName: "Klaudija",
  //   lastName: "Dimić",
  //   email: "profDimic",
  //   password: "kDimić"
  // });

  // var proffesor = await proffesorController.create({
  //   firstName: "Sandra",
  //   lastName: "Gašparić",
  //   email: "profGašparić",
  //   password: "sGašparić"
  // });

  var proffesor = await proffesorController.create({
    firstName: "Ante",
    lastName: "Bartulović",
    email: "profBartulovic",
    password: "prof"
  });

  // var proffesor = await proffesorController.create({
  //   firstName: "Ante",
  //   lastName: "Bartulović",
  //   email: "prof1",
  //   password: "prof1"
  // });

  // var proffesor = await proffesorController.create({
  //   firstName: "Ante",
  //   lastName: "Bartulović",
  //   email: "prof2",
  //   password: "prof2"
  // });

  // var proffesor = await proffesorController.create({
  //   firstName: "Ante",
  //   lastName: "Bartulović",
  //   email: "prof3",
  //   password: "prof3"
  // });
  // var proffesor = await proffesorController.create({
  //   firstName: "Anita",
  //   lastName: "Grgić",
  //   email: "profGrgić",
  //   password: "aGrgić"
  // });status

  // var proffesor = await proffesorController.create({
  //   firstName: "Klaudija",
  //   lastName: "Dimić",
  //   email: "profDimić",
  //   password: "kDimić"
  // });

  // var proffesor = await proffesorController.create({
  //   firstName: "Sandra",
  //   lastName: "Gašparić",
  //   email: "profGašparić",
  //   password: "sGašparić"
  // });
  // var proffesor = await proffesorController.create({
  //   firstName: "Ante",
  //   lastName: "Bartulović",
  //   email: "prof4",
  //   password: "prof4"
  // });

  logger.logData(
    proffesor.get({
      plain: true
    })
  );

  logger.logTest("Add folder to grade");
  status = await gradeController.addFolder(1, 1);
  logger.logData(status);

  logger.logTest("Add test and file to grade");
  status = await folderController.addFile(1, 1);
  logger.logData(status);
  status = await folderController.addTest(1, 1);
  logger.logData(status);

  logger.logTest("Get folder");
  folder = await folderController.get(1);
  logger.logData(folder.get({ plain: true }));

  logger.logTest("Add grade to proffesor");
  status = await proffesorController.addGrade(1, 1);
  logger.logData(status);

  status = await notificationController.create({
    title: "Welcome",
    description: "Pozdrav od kreatora aplikacije"
  });
  status = await gradeController.addNotification(1, 1);

  logger.logTest("Get grade");
  grade = await gradeController.get(1, [Student, Folder, Notification]);
  logger.logData(
    grade.get({
      plain: true
    })
  );
};
