'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    taskName: DataTypes.STRING,
    note: DataTypes.TEXT,
    dueDate: DataTypes.DATE,
    isCompleted: DataTypes.BOOLEAN,
    listId: DataTypes.INTEGER,
    taskTypeId: DataTypes.INTEGER
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};