const express = require('express');
const { User, List, Task } = require('../db/models');
const { asyncHandler, handleValidationErrors, check } = require('./utils');
const { requireAuth } = require('../auth');
const { validationResult } = require('express-validator');

const router = express.Router();

const allListsNotFoundError = () => {
  const err = Error("Lists not found");
  err.errors = [`Lists could not be found.`];
  err.title = "Lists not found.";
  err.status = 404;
  return err;
};

router.get('/',
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

router.post('/',
// requireAuth, //! require authentication for production
validateList,
asyncHandler(async (req, res, next) => {
  const { userId } = req.session.auth; //! use for production on browser
  const { listName } = req.body; //! use for production on browser
  //const { listName, userId } = req.body; //! use for testing in POSTMAN

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
router.put('/:id(\\d+)',
// requireAuth, //! require authentication for production
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

router.delete('/:id(\\d+)',
// requireAuth, //! require authentication for production
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
