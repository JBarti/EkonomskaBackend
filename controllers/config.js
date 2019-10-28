const Sequelize = require("sequelize");

let sequelize;

try {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: true
    }
  });
} catch (error) {
  console.log("OVOOOO SE DESILOOOOO");
  sequelize = new Sequelize("ekonomska", "postgres", "admin", {
    dialect: "postgres",
    host: "0.0.0.0",
    port: 5432
  });
}
const Student = require("../data/models/student")(sequelize, Sequelize);
const Grade = require("../data/models/grade")(sequelize, Sequelize);
const Test = require("../data/models/test")(sequelize, Sequelize);
const Question = require("../data/models/question")(sequelize, Sequelize);
const File = require("../data/models/file")(sequelize, Sequelize);
const Solution = require("../data/models/solution")(sequelize, Sequelize);
const Proffesor = require("../data/models/proffesor")(sequelize, Sequelize);
const Folder = require("../data/models/folder")(sequelize, Sequelize);
const Income = require("../data/models/income")(sequelize, Sequelize);
const Outcome = require("../data/models/outcome")(sequelize, Sequelize);
const Notification = require("../data/models/notification")(
  sequelize,
  Sequelize
);

setup = () => {
  Grade.hasMany(Student);
  Student.belongsTo(Grade);

  Solution.belongsTo(Student);
  Student.hasMany(Solution);

  Folder.hasMany(File);
  Folder.hasMany(Test);

  Grade.hasMany(Folder);
  Grade.hasMany(Notification);

  Test.hasMany(Question);
  Question.belongsTo(Test);

  Student.hasMany(Solution);
  Student.hasMany(Income);
  Student.hasMany(Outcome);

  Proffesor.hasMany(Grade);
  Grade.belongsTo(Proffesor);

  return sequelize.sync({
    force: true
  });
};

module.exports = {
  sequelize,
  Student,
  Grade,
  Test,
  File,
  Question,
  Solution,
  Proffesor,
  Folder,
  Outcome,
  Income,
  Notification,
  setup: () => {
    return setup();
  }
};
