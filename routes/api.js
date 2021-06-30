const express = require('express');
const { User, List, Task } = require('../db/models');
const { asyncHandler, handleValidationErrors, check } = require('./utils');
const { requireAuth } = require('../auth');
const { TableHints } = require('sequelize/types');
const { validationResult } = require('express-validator');

const router = express.Router();

const allListsNotFoundError = () => {
  const err = Error("Lists not found");
  err.errors = [`Lists could not be found.`];
  err.title = "Lists not found.";
  err.status = 404;
  return err;
};

router.get('/lists',
asyncHandler(async (req, res, next) => {
  const lists = await List.findAll();

  if (lists.length) {
    res.json({ lists });
  } else {
    next(allListsNotFoundError());
  }
}));

const listNotFoundError = (id) => {
  const err = Error("List not found");
  err.errors = [`List with id of ${id} could not be found.`];
  err.title = "List not found.";
  err.status = 404;
  return err;
};

const validateList = [
  check("listName")
  .exists({ checkFalsy: true })
  .withMessage("List name can't be empty."),
  check("listName")
  .isLength({ max: 255 })
  .withMessage("List name can't be longer than 255 characters."),
  handleValidationErrors,
];

router.post('/lists',
// requireAuth, //TODO require authentication when making fetch requests
validateList,
asyncHandler(async (req, res, next) => {
  // const { userId } = req.session.auth; //TODO get user id from session.auth
  const { listName, userId } = req.body;

  const list = await List.create({
    listName,
    userId,
  });

  if (list) {
    res.json({ list })
  } else {
    next(listNotFoundError(req.params.id));
  }
}));

// only change the list id
router.put('/lists/:id(\\d+)',
// requireAuth, //TODO require authentication when making fetch requests
asyncHandler(async (req, res, next) => {
  const { listName } = req.body;
  const list = await List.findByPk(req.params.id);

  if (list) {
    await list.update({
      listName,
      });
      res.json({ list });
    } else {
      next(listNotFoundError(req.params.id));
    }
}));

router.delete('/lists/:id(\\d+)',
// requireAuth, //TODO require authentication when making fetch requests
asyncHandler(async (req, res, next) => {
  const list = await List.findByPk(req.params.id)

  if (list) {
    await list.destroy();
    res.json({ msg: `List id ${req.params.id} deleted.` });
  } else {
    next(listNotFoundError(req.params.id));
  }
}));

const taskNotFoundError = (id) => {
  const err = Error('Task not found');
  err.errors = [`Task with id of ${id} is not found.`];
  err.title = 'Task not found.';
  err.status = 404;
  return err;
};

const validateTask = [
  check('taskName')
    .exists({ checkFalsy: true })
    .withMessage('Task name must be filled in.')
    .isLength({ max: 30 })
    .withMessage('Please keep task name at a reasonable length, below 30 characters.')
    .isLength({ min: 3 })
    .withMessage('It may be helpful to have a list with a name longer than 3 characters.'),
  check('note')
    .exists({ checkFalsy: true })
    .withMessage('You might want to add text if you\'re going to make a task')
    .isLength({ max: 75 })
    .withMessage('Keeping your note short and sweet, under 75 characters, might help you stay on target'),
  handleValidationErrors,
];

router.get('/', asyncHandler(async (req, res) => {
  const tasks = await Task.findAll({
    where: { userId: req.session.auth.id },
  });
  if (tasks) {
    res.json({ tasks });
  } else {
    const err = Error('Task not found');
    err.status = 404;
    err.title = 'Task not found.';
    throw err;
  }
}));

router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const task = await Task.findONe({
    where: { id: req.params.id },
    // Might not need both Tag and TagJoin models
    include: [List, TaskType, Tag, TagJoin]
  });
  if (task) {
    res.json({
      taskId: task.id,
      taskName: task.taskName,
      note: task.note,
      dueDate: task.dueDate,
      taskTypeId: task.taskTypeId,
      listId: task.listId,
      // Unsure if this is the correct way to connect.
      tagId: task.TagJoins.tagId,
      list: task.List.listName,
      type: task.TaskType.taskType,

    });
  } else {
    next(taskNotFoundError(req.params.id));
  }
}));

router.post('create', validateTask, asyncHandler(async (req, res) => {
  const { taskName, note, dueDate, taskTypeId, listId } = req.body;

  const task = await Task.build({
    userId: req.session.auth.userId,
    taskName,
    note,
    dueDate,
    taskTypeId,
    listId
  });

  const user = await User.findByPk(req.session.auth.userId, {
    include: [List, Task]
  });

  const validatorErrors = validationResult(req);
  if (validatorErrors.isEmpty()) {
    await task.save();
    res.json({ task });
  } else {
    const taskErrors = validatorErrors.array().map((error) => error.msg);
    res.render('account', {
      // Change to username?
      title: 'Account',
      username: user.username,
      tasks: user.tasks,
      lists: user.Lists,
      task,
      taskErrors
    });
  }
}));

router.put('/:id\\d+)/edit', validateTask, asyncHandler(async (req, res, next) => {
  const {
    taskName,
    note,
    dueDate,
    taskTypeId,
    listId,
    isCompleted,
  } = req.body;

  const task = await Task.findONe({
    where: { id: req.params.id },
  });

  if (req.session.auth.userId !== task.userId) {
    const err = Error('You Shall Not Pass!');
    err.status = 401;
    err.message = 'You have no power here.';
    err.title = 'Move Along';
    throw err;
  }

  if (task) {
    await task.update({
      taskName,
      note,
      dueDate,
      taskTypeId,
      listId,
      isCompleted
    });
    res.json({ task });
  } else {
    next(taskNotFoundError(req.params.id));
  }
}));

router.delete('/:id(\\d+)/delete', asyncHandler(async (req, res, next) => {
  const { taskName } = req.body;
  const releasedTask = taskName;
  const task = await Task.findOne({
    where: { id: req.params.id },
  });

  if (req.session.auth.userId !== task.userId) {
    const err = Error('No Sir');
    err.status= 401;
    err.message = 'This task is not yours to delete';
    err.title = 'Imposter';
    throw err;
  }

  if (task) {
    await task.destroy();
    res.json({ message: `${releasedTask} has been released to the wild(deleted).`});
  } else {
    next(taskNotFoundError(req.params.id));
  }
}));

module.exports = router;
