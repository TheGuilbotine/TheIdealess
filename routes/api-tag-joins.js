const express = require("express");
const { TagJoin } = require("../db/models");
const { asyncHandler, handleValidationErrors, check } = require("./utils");
const { requireAuth } = require("../auth");

const router = express.Router();

const allTagJoinsNotFoundError = () => {
  const err = Error("TagJoin not found");
  err.errors = [`TagJoin was not found.`];
  err.title = "TagJoin not found.";
  err.status = 404;
  return err;
};

router.get("/",
  // requireAuth,
  asyncHandler(async (req, res, next) => {
    const tagJoins = await TagJoin.findAll();
    if (tagJoins) {
      res.json({ tagJoins });
    } else {
      next(allTagJoinsNotFoundError());
    }
  })
);

const tagJoinNotFoundError = (id) => {
  const err = Error("Tag not found");
  err.errors = [`Tag with id of ${id} could not be found.`];
  err.title = "Tag not found.";
  err.status = 404;
  return err;
};

const validateTagJoin = [
  check("tagId")
  .exists({ checkFalsy: true })
  .withMessage("TagId can't be empty."),
  check("taskId")
  .exists({ checkFalsy: true })
  .withMessage("TaskId can't be empty."),
  check("tagId")
  .isInt()
  .withMessage("TagId has to be an integer"),
  check("taskId")
  .isInt()
  .withMessage("TaskId has to be an integer"),
  handleValidationErrors,
];

router.post('/',
  // requireAuth, //! require authentication for production
  validateTagJoin,
  asyncHandler(async (req, res, next) => {
    const { tagId, taskId } = req.body; 

    const tagJoin = await TagJoin.create({
      tagId,
      taskId,
    });

    if (tagJoin) {
      res.json({ tagJoin })
    } else {
      next(tagJoinNotFoundError(req.params.id));
    }
}));

module.exports = router;