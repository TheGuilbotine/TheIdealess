'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    taskName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      note: {
        type: DataTypes.TEXT
      },
      dueDate: {
        type: DataTypes.DATE
      },
      isCompleted: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      listId: {
        allowNull: false, 
        type: DataTypes.INTEGER,
        references: { model: 'Lists'}
      },
      taskTypeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: 'TaskTypes'}
      }
  }, {});
  Task.associate = function(models) {
   Task.belongsTo(models.List, { foreignKey: 'listId'})
   Task.belongsTo(models.TaskType, { foreignKey: 'taskTypeId'})
  };
  return Task;
};
