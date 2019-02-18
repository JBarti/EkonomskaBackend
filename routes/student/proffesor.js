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

router.get("/", async (req, res, next) => {
  console.log("GETN");
  let user = JSON.parse(req.user);
  console.log(user);
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
  const { folderId, test } = req.body;
  let isNew = true;
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

  let ids = [];
  if (test.id) {
    TestController.removeTest(test.id);
    ids = await createQuestions(test);
    isNew = false;
    console.log("NOVA PITANJAAA");
    logger.logData(test.questions);
    console.log("NOVA PITANJAAA");
    logger.logData(ids);
  }

  console.log("PITANJAA");
  console.log(test.questions);
  newTest = await TestController.create({ name: test.name });
  logger.logData(newTest.get({ plain: true }));
  FolderController.addTest(newTest.get({ plain: true }).id, folderId);

  TestController.setQuestions(ids, newTest.id);
  newTest = await TestController.get(newTest.id);
  return res.send({ folderId, test: newTest, isNew: isNew });
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

module.exports = router;
