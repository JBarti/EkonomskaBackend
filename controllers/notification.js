const { Notification } = require("./config");

const Controller = {
  create: ({ title, description, important = false }) => {
    return Notification.create({
      title,
      description,
      important
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
