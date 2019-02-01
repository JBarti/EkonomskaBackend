const {
    File
} = require('./config')


const Controller = {
    create: ({
        name,
        url,
        type = 'pdf',
        folderId,
        active = false
    }) => {
        return File.create({
            name,
            active,
            folderId,
            url,
            type
        })
    },
    get: fileId => {
        return File.find({
            where: {
                id: fileId
            }
        })
    }
}

module.exports = Controller