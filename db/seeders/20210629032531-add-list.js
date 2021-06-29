'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Lists', [
      { listName: 'Pre Travel Checklist', userId: 1, createdAt: new Date(), updatedAt: new Date() },
      { listName: 'What to do in LA', userId: 2, createdAt: new Date(), updatedAt: new Date() },
      { listName: '10 common Portuguese Phrases!', userId: 3, createdAt: new Date(), updatedAt: new Date() },
      { listName: 'Food I love', userId: 4, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Lists', null, {});
  }
};
