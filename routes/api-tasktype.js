const express = require("express");
const { TaskType } = require("../db/models");
const { asyncHandler, handleValidationErrors, check } = require("./utils");
const { requireAuth } = require("../auth");

const router = express.Router();

const allTaskTypeNotFoundError = () => {
  const err = Error("TaskType not found");
  err.errors = [`TaskType was not found.`];
  err.title = "TaskType not found.";
  err.status = 404;
  return err;
};

router.get("/",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskTypes = await TaskType.findAll();
    if (taskTypes) {
      res.json({ taskTypes });
    } else {
      next(allTaskTypeNotFoundError());
    }
  })
);

module.exports = router;