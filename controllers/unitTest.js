const logger = require("../logger");
const studentController = require("./student");
const gradeController = require("./grade");
const financeController = require("./finance");
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
    email: "testtest@gmail.com",
    password: "test"
  };

  logger.logTest("Test create student");
  let student = await studentController.create(testUser);
  logger.logData(student);

  logger.logTest("Test addNotification");
  let status = await studentController.addNotification(1, {
    from: "CreatorsOfApp",
    description: "welcome",
    text: "welcome to the official app",
    important: false
  });
  logger.logData(`${status} added new notification`);

  logger.logTest("Test createRazred");
  grade = await gradeController.create({
    name: "3D"
  });
  logger.logData(
    grade.get({
      plain: true
    })
  );

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

  logger.logTest("Test inactivate user");
  status = await studentController.makeInactive(1, "testtest@gmail.com");
  logger.logMessage(
    status ? "Successfully inactivated user" : "Failed to inactivate user"
  );

  logger.logTest("Test get student");
  try {
    student = await studentController.get(
      "testtest@gmail.com",
      "test",
      (logingIn = false)
    );
  } catch (error) {
    logger.logError(error);
  }
  console.log("\n\n\n");

  console.log(student);
  logger.logData(student);

  logger.logTest("Test check user existence");
  status = await studentController.checkExistance("testtest@gmail.com");
  logger.logMessage(`Email testtest@gmail.com exists: ${status}`);
  status = await studentController.checkExistance("invalidmail@gmail.com");
  logger.logMessage(`Email invalidmail@gmail.com exists: ${status}`);

  logger.logTest("Test create revenue");
  let revenue = await financeController.create({
    name: "testRevenue",
    money: 123,
    type: "revenue"
  });
  logger.logMessage("Created new revenue");
  logger.logData(
    revenue.get({
      plain: true
    })
  );

  logger.logTest("Test create expense");
  let expense = await financeController.create({
    name: "testExpense",
    money: 312,
    type: "expense"
  });
  logger.logMessage("Created new expense");
  logger.logData(
    expense.get({
      plain: true
    })
  );

  logger.logTest("Test create goal");
  let goal = await financeController.create({
    name: "testGoal",
    money: 312,
    type: "goal"
  });
  logger.logMessage("Created new goal");
  logger.logData(
    goal.get({
      plain: true
    })
  );

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

  logger.logTest("Add revenue, expense and goal to user");
  status = await studentController.addFinance(1, 1);
  logger.logMessage(status);
  status = await studentController.addFinance(1, 2);
  logger.logMessage(status);
  status = await studentController.addFinance(1, 3);
  logger.logMessage(status);

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

  var proffesor = await proffesorController.create({
    firstName: "Klaudija",
    lastName: "Dimić",
    email: "profDimić",
    password: "kDimić"
  });

  // var proffesor = await proffesorController.create({
  //   firstName: "Sandra",
  //   lastName: "Gašparić",
  //   email: "profGašparić",
  //   password: "sGašparić"
  // });

  var proffesor = await proffesorController.create({
    firstName: "Ante",
    lastName: "Bartulović",
    email: "profBartulović",
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

  // logger.logTest("Create income");
  // let job = await incomeController.create({
  //   name: "Moj poslić",
  //   amount: 2000,
  //   type: "job",
  //   year: 2
  // });
  // let fee = await incomeController.create({
  //   name: "Test1",
  //   amount: 500,
  //   type: "fee",
  //   year: 2
  // });
  // logger.logData(job.get({ plain: true }));
  // //await studentController.addIncome(1, job.get({ plain: true }).id);
  // logger.logData(fee.get({ plain: true }));
  // //await studentController.addIncome(1, fee.get({ plain: true }).id);

  // logger.logTest("Create outcome");
  // let hrana = await outcomeController.create({
  //   type: "Hrana",
  //   amount: 500,
  //   change: 0,
  //   year: 2
  // });
  // let kredit = await outcomeController.create({
  //   type: "Kredit",
  //   amount: 300,
  //   year: 2
  // });

  // // logger.logData(hrana.get({ plain: true }));
  // // await studentController.addOutcome(1, hrana.get({ plain: true }).id);
  // // logger.logData(kredit.get({ plain: true }));
  // // await studentController.addOutcome(1, kredit.get({ plain: true }).id);

  logger.logTest("Get grade");
  grade = await gradeController.get(1, [Student, Folder, Notification]);
  logger.logData(
    grade.get({
      plain: true
    })
  );
};
