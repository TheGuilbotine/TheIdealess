'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Users', [
      { username: 'samira', firstName: 'Samira', lastName: 'Nielsen', email: 'samira@gmail.com', hashedPassword: '$2a$10$XfIihZrIzfDV1u0zzPrsD.h94lx4MQdWmWK0sKghhVw7JNkj7VjGy', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('Users', null, {});

  }
};
