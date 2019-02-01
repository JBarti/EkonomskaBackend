var passport = require("passport");
var uuid = require("uuid/v4");
var LocalStrategy = require("passport-local").Strategy;
var expressSession = require("express-session");
var FileStore = require("session-file-store")(expressSession);
var logger = require("./logger");
var StudentController = require("./controllers/student");
var ProffesorController = require("./controllers/proffesor");

createAuthPoint = (userType, UserController) => {
  passport.use(
    userType,
    new LocalStrategy(
      {
        usernameField: "email"
      },
      async (email, password, done) => {
        logger.logMessage(`Logging in user ${email} ${password}`);
        let user = undefined;
        try {
          user = await UserController.get(email, password);
        } catch (error) {
          logger.logError(error);
        }
        if (user) {
          user = user.get({ plain: true });
          user.type = userType;
          return done(null, user);
        } else {
          return done("User doesnt exist");
        }
      }
    )
  );
};

createAuthPoint("student", StudentController);
createAuthPoint("proffesor", ProffesorController);

passport.serializeUser(function(user, done) {
  user = JSON.stringify(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var session = expressSession({
  genid: req => {
    logger.logMessage(`Request object sessionID from client: ${req.sessionID}`);
    return uuid(); // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true
});

module.exports = {
  passport,
  session
};
