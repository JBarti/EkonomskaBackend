const { Question } = require('./config')
const Op = require('sequelize').Op

const Controller = {
    create: ({ text, answers }) => {
        return new Promise((resolve, reject) => {
            Question.create({ text, answers })
                .then(question => {
                    resolve(question)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    get: questionId => {
        return Question.find({ where: { id: id } })
    },
    getMultiple: questionIds => {
        return Question.find({
            where: {
                id: {
                    [Op.in]: questionIds
                }
            }
        })
    }
}

module.exports = Controller