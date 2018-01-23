'use strict';

const Sequelize = require('sequelize');

var Factory = {
    defaultHooks: {
        beforeCreate: (record) => {
            let now = Date.now();
            // 如果是新创建的数据
            record.createdAt = now;
            record.updatedAt = now;
            record.version = 0;
            console.log('CREATE');
        },
        beforeUpdate: (record) => {
            let now = Date.now();
            // 如果是更新现有数据
            record.updatedAt = now;
            record.version = 0;
            console.log('UPDATE');
        },
        beforeValidate: (record) => {
            if (!record.createdAt) {
                record.createdAt = 0;
            }
            if (!record.updatedAt) {
                record.updatedAt = 0;
            }
            if (!record.version) {
                record.version = 0;
            }
        }
    },

    /**
     * 包装Model
     * @param {string} modelName 表名
     * @param {*} modelWithName 带名字的model对象
     */
    packModel: (modelWithName, sequelize) => {
        let modelName = modelWithName.name;
        let model = modelWithName.model;
        let hooks = modelWithName.hooks;
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

        if (hooks) {
            // 如果用户自定义了hook则进行合并
            for (const key in Factory.defaultHooks) {
                if (Factory.defaultHooks.hasOwnProperty(key)) {
                    const defaultHookMethod = Factory.defaultHooks[key];

                    if (hooks.hasOwnProperty(key)) {
                        // 如果用户定义的hook属性和默认hook属性重复
                        let hookMethod = hooks[key];
                        hooks[key] = (record) => {
                            // 则先运行默认hook再运行用户定义hook
                            defaultHookMethod(record);
                            hookMethod(record);
                        };
                    } else {
                        // 如果不重复则直接应用以默认hook
                        hooks[key] = defaultHookMethod;
                    }
                }
            }
        } else {
            // 如果用户没有自定义hook则使用默认hook
            hooks = Factory.defaultHooks;
        }

        return sequelize.define(modelName, packedModel, {
            timestamps: false,
            hooks: hooks
        });
    }
}

module.exports = Factory;