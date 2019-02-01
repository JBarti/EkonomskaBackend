module.exports = (sequelize, types) => {
    return sequelize.define('solution', {
        id: {
            type: types.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        solution: {
            type: types.JSON,
            allowNull: false
        },
        testId: {
            type: types.INTEGER,
            allowNull: false
        },
        testPoints: {
            type: types.INTEGER,
            allowNull: false
        },
        studentsPoints: {
            type: types.INTEGER,
            allowNull: false
        }
    })
}