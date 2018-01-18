'use strict';

const Sequelize = require('sequelize');

var studentModel = {
    name: 'student',
    model: {
        name: Sequelize.STRING(10),
        age: Sequelize.INTEGER,
        gender: Sequelize.BOOLEAN,
        height: Sequelize.INTEGER
    },
    hooks: {
        beforeUpdate: (record) => {
            record.age++;
        }
    }
};

module.exports = studentModel;