'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('TaskTypes', [
        { taskType: 'pre-travel', createdAt: new Date(), updatedAt: new Date() },
        { taskType: 'travel', createdAt: new Date(), updatedAt: new Date() },
        { taskType: 'post-travel', createdAt: new Date(), updatedAt: new Date() },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TaskTypes', null, {});
  }
};
