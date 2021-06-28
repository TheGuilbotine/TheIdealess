'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaskType = sequelize.define('TaskType', {
    taskType: DataTypes.STRING
  }, {});
  TaskType.associate = function(models) {
    // associations can be defined here
  };
  return TaskType;
};