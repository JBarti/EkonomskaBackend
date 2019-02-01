var express = require("express");
var logger = require("../../logger");
var StudentController = require("../../controllers/student");
var router = express.Router();
var { passport, session } = require("../../auth");

router.get("/test", function(req, res, next) {
  return res.send("api working");
});

router.get("/", (req, res, next) => {
  let user = JSON.parse(req.user);
  if (!user.type === "student") {
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
  logger.logMessage("Trying to register new user: ");
  logger.logData(req.body);

  let props = ["email", "firstName"];

  if (props.every(val => val in req.body)) {
    logger.logMessage("Request has all neded properties");
    if (!(await StudentController.user.checkExistance(req.body.email))) {
      logger.logMessage("User doesnt exist");
      let user = await StudentController.user.create(req.body);
      logger.logMessage("Created user");
      logger.logData(
        user.get({
          plain: true
        })
      );
      return res.send(
        user.get({
          plain: true
        })
      );
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
  let status = await StudentController.solveTest(req.body);
  return res.send(status);
});

module.exports = router;
