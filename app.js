//Dependencies
let createError = require("http-errors");
let express = require("express");
let logger = require("./logger");
let bodyParser = require("body-parser");
let session = require("express-session");
let cors = require("cors");

//Routes
let indexRouter = require("./routes/student/index");
let studentRouter = require("./routes/student/students");
let proffesorRouter = require("./routes/student/proffesor");

let app = express();

app.disable("x-powered-by");

let { setup } = require("./controllers/config");

setup().then(data => {
  logger.logMessage("Created databse");
  require("./controllers/unitTest")();
});

app.use("/static", express.static("post"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(bodyParser());
app.use(session({
  secret: 'ssshhhhh',
  saveUninitialized: true,
  resave: true,
  loggedIn: true
})
);

let corsOptions = {
  origin: true,
  credentials: true
};

app.use(cors(corsOptions));

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

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
