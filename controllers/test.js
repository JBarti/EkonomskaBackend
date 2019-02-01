const {
    Test
} = require('./config')
const questionController = require('./question')

const Controller = {
    create: ({
        name,
        testId,
        active = false
    }) => {
        return Test.create({
            name,
            active,
            testId
        })
    },

    get: testId => {
        return Test.find({
            where: {
                id: testId
            }
        })
    },
    setQuestions: (questionIds, testId) => {
        return new Promise((resolve, reject) => {
            Controller.get(testId).then(test => {
                test.setQuestions(questionIds)
                resolve('Set tests questions')
            }).catch(err => {
                reject(err)
            })
        })
    },
    removeTest: (testId) => {
        return Test.destroy({
            where: {
                id: testId
            },
        })
    }
}

module.exports = Controller