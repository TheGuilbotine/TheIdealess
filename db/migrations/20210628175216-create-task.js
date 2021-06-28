'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      taskName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.TEXT
      },
      dueDate: {
        type: Sequelize.DATE
      },
      isCompleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      listId: {
        allowNull: false, 
        type: Sequelize.INTEGER,
        references: { model: 'Lists'}
      },
      taskTypeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'TaskTypes'}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tasks');
  }
};
