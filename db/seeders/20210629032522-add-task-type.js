'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('TaskTypes', [
        { taskType: 'pre-travel', createdAt: new Date(), updatedAt: new Date() },
        { taskType: 'travel', createdAt: new Date(), updatedAt: new Date() },
        { taskType: 'eating', createdAt: new Date(), updatedAt: new Date() },
        { taskType: 'relaxing', createdAt: new Date(), updatedAt: new Date() },
        { taskType: 'other', createdAt: new Date(), updatedAt: new Date() },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TaskTypes', null, {});
  }
};
