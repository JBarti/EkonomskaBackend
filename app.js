//Dependencies
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("./logger");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var expressSession = require("express-session");
var FileStore = require("session-file-store")(expressSession);
var { passport, session } = require("./auth");
var cors = require("cors");

//Routes
var indexRouter = require("./routes/student/index");
var studentRouter = require("./routes/student/students");
var proffesorRouter = require("./routes/student/proffesor");

var app = express();

app.disable("x-powered-by");

var { setup } = require("./controllers/config");

setup().then(data => {
  logger.logMessage("Created databse");
  require("./controllers/unitTest")();
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(bodyParser());

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

let corsOptions = {
  origin: true,
  credentials: true
};

app.use(cors());

logger.logImportant(
  "###################\n####APP STARTED####\n###################"
);

app.use("/", indexRouter);
app.use("/proffesor", proffesorRouter);
app.use("/students", studentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error pageć
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
