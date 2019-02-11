const express = require("express");
const logger = require("../../logger");
const ProffesorController = require("../../controllers/proffesor");
const FileController = require("../../controllers/file");
const GradeController = require("../../controllers/grade");
const StudentController = require("../../controllers/student");
const TestController = require("../../controllers/test");
const QuestionController = require("../../controllers/question");
const FolderController = require("../../controllers/folder");
const router = express.Router();

router.get("/test", (req, res, next) => {
  return res.send("test");
});

router.get("/", (req, res, next) => {
  console.log("GETN");
  let user = JSON.parse(req.user);
  console.log(user);
  if (!user.type === "student") {
    return res.status(401).send("User not logged in");
  }
  logger.logData(user);
  if (user) {
    logger.logMessage("Retrieved user data");
    return res.send(user);
  }
  return res.status(401).send("User not logged in");
});

router.get("/logout", (req, res, next) => {
  if (req.user) {
    logger.logMessage("Logging out, user set to inactive");
    req.logout();
    return res.send("Successfully logged out");
  }
  logger.logMessage("Nothing logged out");
  return res.status(400).send("Have nothing to log out");
});

router.get("/get", (req, res, next) => {
  user = JSON.parse(req.user);
  return user.type === "proffesor"
    ? next()
    : res.status(401).send("Unauthorized access");
});

router.use(async (req, res, next) => {
  user = JSON.parse(req.user);
  return user.type !== "student"
    ? next()
    : res.status(401).send("Unauthorized access");
});

router.post("/file", async (req, res, next) => {
  logger.logMessage("TRYING TO ADD FILE");
  let data = await FileController.create({
    name: req.body.name,
    url: req.body.url,
    lesson: req.body.lesson,
    active: true
  });

  let status = await GradeController.addFile(
    data.get({
      plain: true
    }).id,
    req.body.gradeId
  );

  logger.logMessage(status);

  let grade = await GradeController.get(req.body.gradeId);
  logger.logData(
    grade.get({
      plain: true
    })
  );

  grade.students.map(student => {
    StudentController.addNotification(student.id, {
      from: "PROFESOR",
      description: "added text",
      text: `Proffesor has added ${req.body.name} to ${req.body.lesson}. lesson`
    }).then(data => {
      logger.logData(data);
    });
  });

  return res.send(
    data.get({
      plain: true
    })
  );
});

router.post("/test", async (req, res, next) => {
  if (req.body.testId) await TestController.removeTest(req.body.testId);

  let test = await TestController.create({
    name: req.body.testName,
    active: true,
    lesson: req.body.lesson
  });

  let func = async () => {
    return (data = req.body.questions.map(async question => {
      let dt = await QuestionController.create({
        text: question.text,
        answers: question.answers || []
      });
      return dt.get({
        plain: true
      }).id;
    }));
  };
  let idk = await func();
  logger.logText("DATA");
  Promise.all(idk).then(ids => {
    TestController.setQuestions(
      ids,
      test.get({
        plain: true
      }).id
    ).then(data => {});
    GradeController.addTest(
      test.get({
        plain: true
      }).id,
      req.body.gradeId
    );
    grade.students.map(student => {
      StudentController.addNotification(student.id, {
        from: "PROFESOR",
        description: "added test",
        text: `Proffesor has added ${req.body.testName} to 1. lesson`
      }).then(data => {
        logger.logData(data);
      });
    });
    return res.send("DONE");
  });
});

router.post("/student", async (req, res, next) => {
  let { firstName, lastName, email, password } = req.body;
  let student = await StudentController.create({
    firstName,
    lastName,
    email,
    password
  });
  let status = await GradeController.addStudent(student.id, req.body.gradeId);
  logger.logMessage(status);
  return res.send(student);
});

router.post("/folder", async (req, res, next) => {
  let { name, description, gradeId } = req.body;
  let folder = await FolderController.create({
    name,
    description,
    type: "undefined"
  });
  folder = folder.get({ plain: true });
  logger.logData(folder);
  GradeController.addFolder(folder.id, gradeId);
  return res.send(folder);
});

module.exports = router;
