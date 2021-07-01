const express = require("express");
const { User, List, Task, TagJoin, Tag } = require("../db/models");
const { asyncHandler, handleValidationErrors, check } = require("./utils");
const { requireAuth } = require("../auth");
const { validationResult } = require("express-validator");

const router = express.Router();

const taskNotFoundError = (id) => {
  const err = Error("Task not found");
  err.errors = [`Task with id of ${id} is not found.`];
  err.title = "Task not found.";
  err.status = 404;
  return err;
};

const validateTask = [
  check("taskName")
    .exists({ checkFalsy: true })
    .withMessage("Task name must be filled in.")
    .isLength({ max: 30 })
    .withMessage(
      "Please keep task name at a reasonable length, below 30 characters."
    )
    .isLength({ min: 3 })
    .withMessage(
      "It may be helpful to have a list with a name longer than 3 characters."
    ),
  check("note")
    .isLength({ max: 75 })
    .withMessage(
      "Keeping your note short and sweet, under 75 characters, might help you stay on target"
    ),
  handleValidationErrors,
];

router.get("/",
  asyncHandler(async (req, res) => {
    const tasks = await Task.findAll({
      include: [{ model: List, attributes: ['listName'], distinct: true }],
    });
    if (tasks) {
      res.json({ tasks });
    } else {
      const err = Error("Task not found");
      err.status = 404;
      err.title = "Task not found.";
      throw err;
    }
  })
);

router.get("/:id(\\d+)",
  asyncHandler(async (req, res, next) => {
    const task = await Task.findOne({
      where: { id: req.params.id },
      // Might not need both Tag and TagJoin models
      include: [List, TaskType, Tag, TagJoin],
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
  })
);

router.post("/",
  requireAuth,
  validateTask,
  asyncHandler(async (req, res) => {
    const { 
      taskName, 
      note, 
      dueDate, 
      isCompleted,
      listId,
      taskTypeId, 
    } = req.body;

    const task = await Task.build({
      userId: req.session.auth.userId,
      taskName,
      note,
      dueDate,
      isCompleted,
      listId,
      taskTypeId,
    });

    // Authorization if there is time
    // const user = await User.findByPk(req.session.auth.userId, {
    //   include: [List, Task]
    // });

    // const validatorErrors = validationResult(req);
    if (task) {
      await task.save();
      res.json({ task });
    } else {
      next(taskNotFoundError(req.params.id));
      // const taskErrors = validatorErrors.array().map((error) => error.msg);
      // res.render('account', {
      //   // Change to username?
      //   title: 'Account',
      //   // username: user.username,
      //   tasks: user.tasks,
      //   lists: user.Lists,
      //   task,
      //   taskErrors
      // });
    }
  })
);

router.put("/:id(\\d+)",
  requireAuth,
  validateTask,
  asyncHandler(async (req, res, next) => {
    const {
      taskName,
      note,
      dueDate,
      isCompleted,
      listId,
      taskTypeId,
    } = req.body;

    const task = await Task.findOne({
      where: { id: req.params.id },
    });

    if (task) {
      await task.update({
        taskName,
        note,
        dueDate,
        isCompleted,
        listId,
        taskTypeId,
      });
      res.json({ task });
    } else {
      next(taskNotFoundError(req.params.id));
    }
  })
);

router.delete("/:id(\\d+)",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const { taskName } = req.body;
    const releasedTask = taskName;
    const task = await Task.findOne({
      where: { id: req.params.id },
    });

    if (task) {
      await task.destroy();
      res.json({
        message: `${releasedTask} has been released to the wild(deleted).`,
      });
    } else {
      next(taskNotFoundError(req.params.id));
    }
  })
);

module.exports = router;
