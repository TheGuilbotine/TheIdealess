const express = require("express");
const { Tag } = require("../db/models");
const { asyncHandler, handleValidationErrors, check } = require("./utils");
const { requireAuth } = require("../auth");

const router = express.Router();

const allTagsNotFoundError = () => {
  const err = Error("Tag not found");
  err.errors = [`Tag was not found.`];
  err.title = "Tag not found.";
  err.status = 404;
  return err;
};

router.get("/",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const tags = await Tag.findAll();
    if (tags) {
      res.json({ tags });
    } else {
      next(allTagsNotFoundError());
    }
  })
);

const tagNotFoundError = (id) => {
  const err = Error("Tag not found");
  err.errors = [`Tag with id of ${id} could not be found.`];
  err.title = "Tag not found.";
  err.status = 404;
  return err;
};

const validateTag = [
  check("name")
  .exists({ checkFalsy: true })
  .withMessage("Tag name can't be empty."),
  check("name")
  .isLength({ max: 60 })
  .withMessage("Tag name can't be longer than 60 characters.")
  .custom((value) => {
      return Tag.findOne({
        where: { name: value }
      })
        .then((tag) => {
          if (tag) {
            return Promise.reject('Sorry this tag is already in use')
          }
        });
    }),
  handleValidationErrors,
];

router.post('/',
  requireAuth, 
  validateTag,
  asyncHandler(async (req, res, next) => {
    const { name } = req.body; 

    const tag = await Tag.create({
      name,
    });

    if (tag) {
      res.json({ tag })
    } else {
      next(tagNotFoundError(req.params.id));
    }
}));

module.exports = router;