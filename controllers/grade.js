const { Grade, Student, Finance, Test } = require('./config')
const studentController = require('./student')
const testController = require('./test')
const logger = require('../logger')

const Controller = {
    create: ({ name }) => {
        return Grade.create({ name })
    },
    get: (gradeId, includeModel = [Student]) => {
        include = includeModel.map(model => {
            return { model: model }
        })
        return Grade.find({ where: { id: gradeId }, include: include })
    },
    addStudent: (studentId, gradeId) => {
        return new Promise((resolve, reject) => {
            Controller.get(gradeId).then(razred => {
                grade.addStudent(studentId)
                resolve('added student to grade')
            }).catch(err => {
                reject(err)
            })
        })
    },
    addFolder: (folderId, gradeId) => {
        return new Promise((resolve, reject) => {
            Controller.get(gradeId).then(razred => {
                grade.addFolder(folderId)
                resolve('added folder to grade')
            }).catch(err => {
                reject(err)
            })
        })
    },
}

module.exports = Controller