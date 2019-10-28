let express = require("express");
let gradeController = require("../../controllers/grade");
let studentController = require("../../controllers/student");
let proffesorController = require("../../controllers/proffesor");

let router = express.Router();

/* GET home page. */
router.get("/test", (req, res, next) => {
  res.send("Works");
});


router.get("/login", async (req, res, next) => {
  const credentials_base64 = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(credentials_base64, "base64").toString("utf-8");
  const [email, password] = credentials.split(":");
  let user = undefined;
  try {
    user = await studentController.get(email, password);
    req.session.userId = user.id;
    req.session.userType = "student";
    if(user) return res.send({user: user, type: "STUDENT"});
  } catch (e) {}

  try {
    user = await proffesorController.get(email, password);
    req.session.userId = user.id;
    req.session.userType = "proffesor";
    if(user) return res.send({user: user, type: "PROFFESOR"});
  }catch (e) {}

  return res.status(401).send();
});


router.get("/logout", (req, res, next) => {
  try{
    req.session.destroy();
  }catch (exception) {
  }

  return res.send("");

});


router.get("/grades", async (req, res, next) => {
  let grades = await gradeController.getAll();
  return res.send(grades);
});

module.exports = router;
