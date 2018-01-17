'use strict';

const fs = require('fs');
const Sequelize = require('sequelize');
const config = require('./_config');
const Factory = require('./_factory');

function ModelManager() {
    if (!(this instanceof ModelManager)) {
        return new ModelManager();
    }

    this.models = getAllModels();
};

// 新建Sequelize对象
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    operatorsAliases: Sequelize.Op,
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

var getAllModels = () => {
    // 获取当前文件夹下的所有文件
    let allFiles = fs.readdirSync(__dirname);
    // 筛选出model文件
    let modelFiles = allFiles.filter((fileName) => {
        return /^model\_\w+.js$/.test(fileName) && fileName !== __filename.split('\\').pop();
    });

    let models = new Map();

    // 动态导入所有model文件
    modelFiles.forEach(modelFile => {
        // 获取model类
        let Model = require(`${__dirname}\\${modelFile}`);
        // 获取对应的model并放入Map中
        models.set(Model.name, Factory.packModel(Model.name, Model.model, sequelize));
    });

    return models;
};

/**
 * 获取对应的Model
 * @param {string} modelName Model名字（一般是表名）
 */
ModelManager.prototype.getModel = function (modelName) {
    if (this.models.has(modelName)) {
        return this.models.get(modelName);
    } else {
        console.error(`Cant find model: ${modelName}`);
    }
};

// 把所有define的model生成对应的表
ModelManager.prototype.sync = function () {
    if (process.env.NODE_ENV !== 'production') {
        sequelize.sync();
    }
};

module.exports = ModelManager;