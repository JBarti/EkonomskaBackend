const { Notification } = require("./config");

const Controller = {
  create: ({ title, description }) => {
    return Notification.create({
      title,
      description,
    });
  },
  removeNotification: notificationId => {
    return Notification.destroy({
      where: {
        id: notificationId
      }
    });
  }
};

module.exports = Controller;
