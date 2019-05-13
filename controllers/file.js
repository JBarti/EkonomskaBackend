const { File } = require("./config");

const Controller = {
  create: ({ name, url, type = "pdf", active = true }) => {
    return File.create({
      name,
      url,
      active
    });
  },
  get: fileId => {
    return File.find({
      where: {
        id: fileId
      }
    });
  },
  delete: fileId => {
    return File.destroy({ where: { id: fileId } });
  }
};

module.exports = Controller;
