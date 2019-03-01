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
  sequelize = new Sequelize("ekonomska", "postgres", "admin", {
    dialect: "postgres",
    host: "localhost",
    port: 5432
  });
}
const Student = require("../data/models/student")(sequelize, Sequelize);
const Grade = require("../data/models/grade")(sequelize, Sequelize);
const Finance = require("../data/models/finance")(sequelize, Sequelize);
const Test = require("../data/models/test")(sequelize, Sequelize);
const Question = require("../data/models/question")(sequelize, Sequelize);
const File = require("../data/models/file")(sequelize, Sequelize);
const Solution = require("../data/models/solution")(sequelize, Sequelize);
const Proffesor = require("../data/models/proffesor")(sequelize, Sequelize);
const Folder = require("../data/models/folder")(sequelize, Sequelize);
const Notification = require("../data/models/notification")(
  sequelize,
  Sequelize
);

setup = () => {
  Grade.hasMany(Student);
  Student.belongsTo(Grade);

  Student.hasMany(Solution);

  Student.belongsToMany(Finance, {
    through: "StudentFinance"
  });
  Finance.belongsToMany(Student, {
    through: "StudentFinance"
  });

  Folder.hasMany(File);
  Folder.hasMany(Test);

  Grade.hasMany(Folder);
  Grade.hasMany(Notification);

  Test.belongsToMany(Question, {
    through: "TestQuestion"
  });

  Question.belongsToMany(Test, {
    through: "TestQuestion"
  });

  Student.hasMany(Solution);

  Proffesor.hasMany(Grade);

  return sequelize.sync({
    force: true
  });
};

module.exports = {
  Student,
  Grade,
  Finance,
  Test,
  File,
  Question,
  sequelize,
  Solution,
  Proffesor,
  Folder,
  Notification,
  setup: () => {
    return setup();
  }
};
