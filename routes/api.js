const express = require('express');
const { List, Task, User } = require('../db/models');
const { asyncHandler, handleValidationErrors, check } = require('./utils');
const { requireAuth } = require('../auth');

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
    const lists = await List.findAll({
      include: Task
    });

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
    const { userId } = req.session.auth; //TODO get user id from session.auth
    const { listName } = req.body;
    
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

module.exports = router;