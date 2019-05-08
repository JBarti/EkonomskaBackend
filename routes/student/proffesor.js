const express = require("express");
const logger = require("../../logger");
const ProffesorController = require("../../controllers/proffesor");
const FileController = require("../../controllers/file");
const GradeController = require("../../controllers/grade");
const NotificationController = require("../../controllers/notification");
const StudentController = require("../../controllers/student");
const TestController = require("../../controllers/test");
const QuestionController = require("../../controllers/question");
const FolderController = require("../../controllers/folder");
const router = express.Router();

router.get("/test", (req, res, next) => {
  return res.send("test");
});

router.get("/", async (req, res, next) => {
  console.log("GETN");
  let user = {};

  try {
    user = JSON.parse(req.user);
  } catch (error) {
    return res.status(403).send("0");
  }
  console.log(user.id);
  if (!user.type === "student") {
    return res.status(401).send("User not logged in");
  }
  logger.logData(user);
  if (user) {
    logger.logMessage("Retrieved user data");
    user = await ProffesorController.getById(user.id);
    return res.send(user.get({ plain: true }));
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
  let { pdf, folderId } = req.body;
  let { name, url } = pdf;
  link = url;
  let file = await FileController.create({ name, url: link });
  file = file.get({ plain: true });
  await FolderController.addFile(file.id, folderId);
  return res.send({ folderId, file });
});

router.delete("/file", async (req, res, next) => {
  let { fileId, folderId } = req.body;
  let status = await FileController.delete(fileId);
  return res.send({ fileId, folderId });
});

router.post("/test", async (req, res, next) => {
  const { folderId, test } = req.body;
  let isNew = true;
  let newIds = [];
  createQuestions = async test => {
    let ids = [];
    for (i = 0; i < test.questions.length; i++) {
      console.log("PITANJE");
      console.log(test.questions[i]);
      question = test.questions[i];
      if (question.id) {
        let oldQ = { ...question };
        QuestionController.delete(question.id);
        let newQ = await QuestionController.create({
          text: oldQ.text,
          answers: oldQ.answers
        });
        ids.push(newQ.get({ plain: true }).id);
      } else {
        let newQ = await QuestionController.create({
          text: question.text,
          answers: question.answers
        });
        ids.push(newQ.get({ plain: true }).id);
      }
    }
    return ids;
  };
  console.log(test.questions);
  newTest = await TestController.create({
    name: test.name,
    isQuiz: test.isQuiz
  });
  logger.logData(newTest.get({ plain: true }));
  FolderController.addTest(newTest.get({ plain: true }).id, folderId);

  if (test.id >= 0) {
    console.log("REMOVA SAN GA");
    TestController.removeTest(test.id);
    newIds = await createQuestions(test);
    isNew = false;
  }

  console.log("AJDIEVI", newIds);

  let status = await TestController.setQuestions(newIds, newTest.id);
  newTest = await TestController.get(newTest.id);
  console.log("\n\n\n");
  console.log(status);
  console.log(newTest);
  return res.send({ folderId, test: newTest, oldId: isNew ? -1 : test.id });
});

router.delete("/test", async (req, res, next) => {
  const { testId, folderId } = req.body;
  let status = await TestController.removeTest(testId);
  return res.send({ testId, folderId });
});

router.post("/test/lock", async (req, res, next) => {
  let { testId, folderId } = req.body;
  let status = await TestController.lock(testId);
  res.send({ testId, folderId });
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

router.post("/student/update", async (req, res, next) => {
  let { firstName, lastName, email, password, id } = req.body;
  logger.logData(password);
  let student = await StudentController.updateCredentials(
    id,
    firstName,
    lastName,
    email,
    password
  );
  logger.logData(student);
  return res.send({ firstName, lastName, email, password, id });
});

router.delete("/student", async (req, res, next) => {
  let { studentId } = req.body;
  let status = StudentController.remove(studentId);
  return res.send({ studentId });
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

router.post("/folder/update", async (req, res, next) => {
  let { folderId, name } = req.body;
  logger.logData(name);
  console.log("\nWORKS");
  FolderController.changeName(folderId, name);
  return res.send({ folderId, name });
});

router.post("/grade", async (req, res, next) => {
  let { name, proffesorId } = req.body;
  let grade = await GradeController.create({ name });
  console.log(grade);
  let x = await ProffesorController.addGrade(proffesorId, grade.id);
  return res.send({ grade: grade.get({ plain: true }) });
});

router.post("/solutions", async (req, res, next) => {
  let { ids, gradeId } = req.body;
  logger.logData(ids);
  logger.logData(gradeId);
  let solutions = await StudentController.getGradeSolutions(ids);
  solutions = solutions.map(solution => {
    return solution.dataValues;
  });
  return res.send({ solutions, gradeId });
});

router.post("/notifications", async (req, res, next) => {
  let { title, description, gradeId } = req.body;
  let notification = await NotificationController.create({
    title,
    description
  });
  await GradeController.addNotification(notification.id, gradeId);
  return res.send({ notification, gradeId });
});

router.delete("/notifications", async (req, res, next) => {
  let { notificationId } = req.body;
  let status = await NotificationController.removeNotification(notificationId);
  return res.send({ notificationId });
});

router.post("/financialYear", async (req, res, next) => {
  let { financialYear, gradeId } = req.body;
  logger.logMessage("INCREMENT");
  GradeController.setFinancialYear(financialYear, gradeId);
  return res.send({ financialYear, gradeId });
});

module.exports = router;
