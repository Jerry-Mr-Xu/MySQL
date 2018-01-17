'use strict';

const Sequelize = require('sequelize');

var studentModel = {
    name: 'student',
    model: {
        name: Sequelize.STRING(10),
        age: Sequelize.INTEGER,
        gender: Sequelize.BOOLEAN,
        height: Sequelize.INTEGER
    }
};

module.exports = studentModel;