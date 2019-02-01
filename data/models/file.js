module.exports = (sequelize, types) => {
    return sequelize.define('file', {
        id: {
            type: types.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: types.STRING,
            allowNull: false
        },
        active: {
            type: types.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        url: {
            type: types.STRING,
            allowNull: false,
            validate: { isUrl: true }
        },
        type: {
            type: types.ENUM('pdf', 'mp4', 'webm', 'ogg', 'png', 'jpg', 'jpeg'),
            allowNull: false
        },
    })
}