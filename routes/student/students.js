const express = require("express");
const logger = require("../../logger");
const StudentController = require("../../controllers/student");
const TestController = require("../../controllers/test");
const GradeController = require("../../controllers/grade");
const outcomeController = require("../../controllers/outcome");
const incomeController = require("../../controllers/income");
const financialHelper = require("./financialPickerHelper.js");

const router = express.Router();

router.get("/test", function(req, res, next) {
  return res.send("api working");
});

router.get("/", async (req, res, next) => {
  const { userId } = req.session;
  console.log("TEST TEST", userId);
  if (userId) {
    const student = await StudentController.getById(userId);
    if(student) return res.send({user: student.get({plain: true}), type: "STUDENT"});
  }

  return res.status(403).send();
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
  let gradeId = req.body.grade;
  console.log(req.body);
  logger.logMessage("Trying to register new user: ");

  const props = ["email", "firstName", "lastName", "password", "grade"];

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
      await GradeController.addStudent(user.get({ plain: true }).id, gradeId);

      let studentId = user.get({ plain: true }).id;
      let outcomes = outcomeController.types.slice(0, 7);
      let outcomePrices = [1800, 1500, 500, 400, 200, 100, 500];
      let newOutcomes = [];
      for (let outcomeType in outcomes) {
        for (let year in [1, 2, 3, 4, 5, 6, 7]) {
          let outcome = await outcomeController.create({
            type: outcomes[outcomeType].name,
            amount: outcomePrices[outcomeType],
            change: outcomes[outcomeType].locked ? null : 0,
            year: Number(year) + 1,
            duration: 1
          });
          await StudentController.addOutcome(
            studentId,
            outcome.get({ plain: true }).id
          );
          newOutcomes.push(outcome.get({ plain: true }));
        }
      }

      logger.logTest("Create income");
      let job = await incomeController.create({
        name: "Posao",
        amount: 5000,
        type: "job",
        year: 1
      });
      logger.logData(job.get({ plain: true }));
      await StudentController.addIncome(studentId, job.get({ plain: true }).id);

      return res.send({ user, gradeId });
    } else {
      return res.status(403).send("User already exists");
    }
  } else {
    return res.status(400).send("Insufficient request data");
  }
});

router.use((req, res, next) => {
  const userId = req.session.userId;
  const userType = req.session.userType;
  return userId && userType === "student"
    ? next()
    : res.status(401).send("Unauthorized access");
});

router.get("/get", (req, res, next) => {
  const { userId, userType } = req.session;
});

router.post("/test/solve", async (req, res, next) => {
  logger.logMessage("Passing test solution");
  let solution = await TestController.solveTest(req.body);
  status = solution.get({ plain: true });
  res.send(status);
  logger.logData(solution);
  let test = await TestController.get(status.testId);
  test = test.get({ plain: true });
  logger.logData(test.questions);
  if (test.isQuiz) {
    let percent = solution.points / test.questions.length;
    if (percent >= 0.5) {
      let money = Math.round(5 + (percent - 0.5) * 40);
      let year = Math.round(Math.random() * 7);
      let income = await incomeController.create({
        name: test.name,
        amount: money,
        type: "fee",
        year: year
      });
      await StudentController.addIncome(req.body.studentId, income.id);
    }
  }
  return;
});

router.post("/year/1", async (req, res, next) => {
  logger.logMessage("Setting up year 1");

  const { variant, studentId } = req.body;
  let { jobPayment, jobCredit, jobName, duration } = financialHelper.firstChoice(variant);


  logger.logTest("Create income");
  let job = await incomeController.create({
    name: jobName,
    amount: jobPayment,
    type: "fee",
    year: 1
  });
  logger.logData(job.get({ plain: true }));
  await StudentController.addIncome(studentId, job.get({ plain: true }).id);

  let kredit = await outcomeController.create({
    type: "Kredit",
    amount: jobCredit,
    year: 1,
    duration: 5
  });

  logger.logData(kredit.get({ plain: true }));
  await StudentController.addOutcome(studentId, kredit.get({ plain: true }).id);
  return res.send({ outcomes: kredit, job: job });
});

router.post("/year/2", async (req, res, next) => {
  logger.logMessage("Setting up year 2");
  let { studentId, variant } = req.body;

  let { outcome, duration } = financialHelper.unexpectedOutcome(variant);

  let avarageOutcome = outcome;
  let realOutcome = Math.round(outcome - outcome * Math.random() * 0.03); // Randomize outcome for 3%


  let kredit = await outcomeController.create({
    type: "Neočekivano",
    amount: realOutcome / duration / 12,
    year: 2,
    duration: duration
  });

  logger.logData(kredit.get({ plain: true }));
  await StudentController.addOutcome(studentId, kredit.get({ plain: true }).id);
  return res.send({ outcome: kredit.get({ plain: true }) });
});

router.post("/year/3", async (req, res, next) => {
  logger.logMessage("Setting up year 3");
  let { studentId, totalSavings, variant } = req.body;
  let interestRate = financialHelper(variant);

  if (totalSavings <= 0) {
    let saving = await incomeController.create({
      type: "saving",
      name: "Ulaganje",
      amount: 0,
      year: 0,
      duration: 0
    });

    await StudentController.addIncome(
      studentId,
      saving.get({ plain: true }).id
    );

    return res.send({ saving: saving.get({ plain: true }) });
  }

  let saving = await incomeController.create({
    type: "saving",
    name: "Ulaganje",
    amount: totalSavings * Math.pow(1 + interestRate / 100, 1),
    year: 6,
    duration: 1
  });

  await StudentController.addIncome(studentId, saving.get({ plain: true }).id);
  return res.send({ saving: saving.get({ plain: true }) });
});

router.post("/outcomes", async (req, res, next) => {
  let { outcomes } = req.body;
  await outcomeController.changeAmount(outcomes);
  return res.send("DONE");
});

module.exports = router;
