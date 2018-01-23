'use strict';

const modelManager = require('./models/_manager')();

var Student = modelManager.getModel('student');

(async () => {
    // 初始化数据库
    await modelManager.sync();
    // 添加一条数据
    let student = await Student.create({
        name: 'jerry',
        age: 22,
        gender: false,
        height: 188
    });
})();