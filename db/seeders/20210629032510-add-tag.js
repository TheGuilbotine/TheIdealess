'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tags', [
      { name: 'Los Angeles', createdAt: new Date(), updatedAt: new Date() },
      { name: 'travel prep', createdAt: new Date(), updatedAt: new Date() },
      { name: 'night out', createdAt: new Date(), updatedAt: new Date() },
      { name: 'good food', createdAt: new Date(), updatedAt: new Date() },
      { name: 'summer', createdAt: new Date(), updatedAt: new Date() },
      { name: '$', createdAt: new Date(), updatedAt: new Date() },
      { name: '$$', createdAt: new Date(), updatedAt: new Date() },
      { name: '$$$', createdAt: new Date(), updatedAt: new Date() },
      { name: 'educational', createdAt: new Date(), updatedAt: new Date() },
      { name: 'language', createdAt: new Date(), updatedAt: new Date() },
      { name: 'santa monica', createdAt: new Date(), updatedAt: new Date() },
      { name: 'prepare', createdAt: new Date(), updatedAt: new Date() },
      { name: 'documents', createdAt: new Date(), updatedAt: new Date() },
      { name: 'family', createdAt: new Date(), updatedAt: new Date() },
      { name: 'morning', createdAt: new Date(), updatedAt: new Date() },
      { name: 'brunch', createdAt: new Date(), updatedAt: new Date() },
      { name: 'walking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'biking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'language', createdAt: new Date(), updatedAt: new Date() },
      { name: 'portuguese', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tags', null, {});
  }
};
