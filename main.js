'use strict';

const modelManager = require('./models/_manager')();

var Student = modelManager.getModel('student');

(async () => {
    let jerry = await Student.findOne({
        where: {
            name: 'jerry'
        }
    })
    await jerry.save();
})();