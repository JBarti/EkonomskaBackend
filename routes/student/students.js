const express = require("express");
const logger = require("../../logger");
const StudentController = require("../../controllers/student");
const TestController = require("../../controllers/test");
const GradeController = require("../../controllers/grade");
const { passport, session } = require("../../auth");

const router = express.Router();

router.get("/test", function(req, res, next) {
  return res.send("api working");
});

router.get("/", (req, res, next) => {
  const user = JSON.parse(req.user);
  if (user.type !== "student") {
    return res.status(401).send("User not logged in");
  }
  logger.logMessage("Retrieved user data");
  logger.logData(user);
  if (user) {
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

router.post("/register", async (req, res, next) => {
  let gradeId = req.body.gradeId;
  logger.logMessage("Trying to register new user: ");
  req.body = req.body.student;
  logger.logData(req.body);

  const props = ["email", "firstName", "lastName", "password"];

  console.log(req.body);
  console.log(req.body.email);

  if (props.every(val => val in req.body)) {
    logger.logMessage("Request has all neded properties");
    if (!(await StudentController.checkExistance(req.body.email))) {
      logger.logMessage("User doesnt exist");
      const user = await StudentController.create(req.body);
      logger.logMessage("Created user");
      logger.logData(
        user.get({
          plain: true
        })
      );
      GradeController.addStudent(user.get({ plain: true }).id, gradeId);
      return res.send({ user: user.get({ plain: true }), gradeId });
    } else {
      return res.status(403).send("User already exists");
    }
  } else {
    return res.status(400).send("Insufficient request data");
  }
});

router.use((req, res, next) => {
  user = JSON.parse(req.user);
  return user.type === "student"
    ? next()
    : res.status(401).send("Unauthorized access");
});

router.get("/get", (req, res, next) => {
  return res.send(JSON.parse(req.user));
});

router.post("/test/solve", async (req, res, next) => {
  logger.logMessage("Passing test solution");
  const status = await TestController.solveTest(req.body);
  return res.send(status);
});

module.exports = router;
