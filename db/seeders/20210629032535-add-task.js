'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [
      { taskName: 'Visit the Getty Center', note: null, dueDate: null, isCompleted: false, listId: 2, taskTypeId: 2, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Eat at a restaurant in Culver City', note: null, dueDate: null, isCompleted: false, listId: 2, taskTypeId: 3, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Walk in Santa Monica on Third Street Promenade', note: null, dueDate: null, isCompleted: false, listId: 2, taskTypeId: 2, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'See a show at the Hollywood Bowl', note: null, dueDate: null, isCompleted: false, listId: 2, taskTypeId: 2, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Visit Little Tokyo on Sawtelle Blvd', note: null, dueDate: null, isCompleted: false, listId: 2, taskTypeId: 2, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Visit the Huntington Gardens', note: null, dueDate: null, isCompleted: false, listId: 2, taskTypeId: 4, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Eat Korean BBQ in Korea Town', note: null, dueDate: null, isCompleted: false, listId: 2, taskTypeId: 3, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Tudo bem? - How are you?', note: null, dueDate: null, isCompleted: false, listId: 3, taskTypeId: 5, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Com Licenca - Excuse me', note: null, dueDate: null, isCompleted: false, listId: 3, taskTypeId: 5, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Deixe eu te falar - Let me tell you', note: null, dueDate: null, isCompleted: false, listId: 3, taskTypeId: 5, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Vai dar certo - it will work out', note: null, dueDate: null, isCompleted: false, listId: 3, taskTypeId: 5, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Deixe para la - forget about it', note: null, dueDate: null, isCompleted: false, listId: 3, taskTypeId: 5, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Fala a verdade - tell the truth', note: null, dueDate: null, isCompleted: false, listId: 3, taskTypeId: 5, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Tchau. Ate mais. - Bye. See you later.', note: null, dueDate: null, isCompleted: false, listId: 3, taskTypeId: 5, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Undergarments', note: null, dueDate: null, isCompleted: false, listId: 1, taskTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Socks', note: null, dueDate: null, isCompleted: false, listId: 1, taskTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Shoes', note: null, dueDate: null, isCompleted: false, listId: 1, taskTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Passport', note: null, dueDate: null, isCompleted: false, listId: 1, taskTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Blouses/Shirts', note: null, dueDate: null, isCompleted: false, listId: 1, taskTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Pants/Shorts', note: null, dueDate: null, isCompleted: false, listId: 1, taskTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Money', note: null, dueDate: null, isCompleted: false, listId: 1, taskTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
      { taskName: 'Airline Tickets', note: null, dueDate: null, isCompleted: false, listId: 1, taskTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tasks', null, {});
  }
};
