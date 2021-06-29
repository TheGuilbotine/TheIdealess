'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Users', [
      { username: 'samira', firstName: 'Samira', lastName: 'Nielsen', email: 'samira@gmail.com', hashedPassword: '$2a$10$XfIihZrIzfDV1u0zzPrsD.h94lx4MQdWmWK0sKghhVw7JNkj7VjGy', createdAt: new Date(), updatedAt: new Date() },
      { username: 'sashimi_please', firstName: 'Pudds', lastName: 'The Cat', email: 'sleepallday@yahoo.com', hashedPassword: '$2a$10$w2udPPTUdbDB7DrzolHEYe.KtIe1YlHCIqoAulVw6PhiJ1vtWs2Pa', createdAt: new Date(), updatedAt: new Date() },
      { username: 'stillGotAHeart', firstName: 'Darth', lastName: 'Vader', email: 'darthvrocks@evil.com', hashedPassword: '$2a$10$2wujc8RQ64T8MlzPh5B4V.EPjF1.IA2O0V5Z5qA9PwRAnokixH4Sq', createdAt: new Date(), updatedAt: new Date() },
      { username: 'littleMissPerfect', firstName: 'Hermione', lastName: 'Granger', email: 'queenslug@hogwarts.edu', hashedPassword: '$2a$10$2IvS3F2alK7ZAZCbdwljW.Vg79KD7Dcn9RiGFcmAuOc17h0l91VdS', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('Users', null, {});

  }
};
