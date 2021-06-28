'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaskType = sequelize.define('TaskType', {
    taskType: {
        allowNull: false,
        type: DataTypes.STRING
      }
  }, {});
  TaskType.associate = function(models) {
   TaskType.hasMany(models.Task, { foreginKey: 'taskTypeId'})
  };
  return TaskType;
};
