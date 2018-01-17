'use strict';

const Sequelize = require('sequelize');

var Factory = {
    /**
     * 包装Model
     * @param {string} modelName 表名
     * @param {object} model model对象
     * @param {*} sequelize Sequelize对象
     */
    packModel: (modelName, model, sequelize) => {
        let packedModel = {};

        // 为每个字段加上非空条件（除非显式指定可以为空）
        for (const columnName in model) {
            if (model.hasOwnProperty(columnName)) {
                const columnType = model[columnName];

                if (typeof columnType === 'object' && columnType.type) {
                    // 加上非空（除非显式指定可以为空）
                    columnType.allowNull = columnType.allowNull || false;
                    // 将修改后的字段添加到包装后Model中
                    packedModel[columnName] = columnType;
                } else {
                    // 加上非空
                    packedModel[columnName] = {
                        type: columnType,
                        allowNull: false
                    };
                }
            }
        }

        // 加上主键id
        packedModel.id = {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        };

        // 创建于
        packedModel.createdAt = { type: Sequelize.BIGINT, allowNull: false };
        // 修改于
        packedModel.updatedAt = { type: Sequelize.BIGINT, allowNull: false };
        // 版本号
        packedModel.version = { type: Sequelize.INTEGER, allowNull: false };

        return sequelize.define(modelName, packedModel, {
            timestamps: false,
            hooks: {
                beforeValidate: (obj) => {
                    let now = Date.now();
                    if (obj.isNewRecord) {
                        console.log('ADD');
                        // 如果是新增的数据
                        obj.createdAt = now;
                        obj.updatedAt = now;
                        obj.version = 0;
                    } else {
                        console.log(JSON.stringify(obj));
                        // 如果是更新现有数据
                        obj.updatedAt = now;
                        obj.version = 0;
                        console.log(JSON.stringify(obj));
                    }
                }
            }
        });
    }
}

module.exports = Factory;