var express = require("express");
var router = express.Router();
var logger = require("../../logger");
var { passport, session } = require("../../auth");

/* GET home page. */
router.get("/test", (req, res, next) => {
  res.send("Works");
});

router.post("/login", [
  (req, res, next) => {
    passport.authenticate("proffesor", (err, user, info) => {
      logger.logText(`User logged in`);
      logger.logData(user);
      if (err) {
        logger.logText("GOT AN ERROR");
        logger.logError(err);
        return next();
      }
      req.login(user, err => {
        if (!user) {
          return next();
        }
        logger.logMessage("User credentials set to:");
        logger.logData(user);
        return res.send(user);
      });
    })(req, res, next);
  },

  (req, res, next) => {
    passport.authenticate("student", (err, user, info) => {
      logger.logText(`User logged in`);
      logger.logData(user);
      if (err) {
        logger.logText("GOT AN ERROR");
        logger.logError(err);
        return res.status(400).send({
          error: "User not found"
        });
      }
      req.login(user, err => {
        if (!user)
          return res.status(400).send({
            error: "Invalid credentials"
          });
        logger.logMessage("User credentials set to:");
        logger.logData(user);
        return res.send(user);
      });
    })(req, res, next);
  }
]);

module.exports = router;
