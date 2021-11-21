const { Router } = require("express");
const validateSession = require("../middleware/validate-session");
const { commentsModel } = require("../models");

const router = Router();

// Create Comment
router.post("/create", validateSession, async (req, res) => {
  const { comment, postId } = req.body;

  try {
    await commentsModel
      .create({
        comment: comment,
        userId: req.user.id,
        postId: postId,
        owner: req.user.username
      })
      .then((comment) => {
        res.status(200).json({
          comment: comment,
          message: "Comment listed",
        });
      });
  } catch (err) {
    res.status(500).json({
      comment: comment,
      error: `Comment creation Failed: ${err}`,
    });
  }
});

// Get all Comments
router.get("/get", async (req, res) => {
  try {
    const allComments = await commentsModel.findAll();
    res.status(200).json({ allComments });
  } catch (err) {
    res.status(500).json({
      message: `Server error ${err}`,
    });
  }
});

// Get comments by Post

router.get("/:postId", async (req, res) => {
  const {postId} = req.params;
  try {
    const results = await commentsModel.findAll({
      where: {
        postId: postId
      }
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({
      error: err
    });
  };
});

// Edit your comments
router.put("/edit/:id", validateSession, async (req, res) => {
  const { comment } = req.body;
  if (req.user.admin === true) {
    query = { where: { id: req.params.id } };
  } else {
    query = { where: { id: req.params.id, userId: req.user.id } };
  }
  const updatedComment = {
    comment: comment,
  };
  try {
    const update = await commentsModel.update(updatedComment, query);
    if (update[0] !== 0) {
      res.status(200).json({
        message: "Comment edited",
        update,
      });
    } else {
      res.status(301).json({
        message: "not authorized",
      })
    } 
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

// Delete Comments
router.delete("/delete/:id", validateSession, async (req, res) => {
  if (req.user.admin === true) {
    query = { where: { id: req.params.id } };
  } else {
    query = { where: { id: req.params.id, userId: req.user.id } };
  }
  try {
    const deletedComment = await commentsModel.destroy(query);
    if (deletedComment !== 0) {
      res.status(200).json({
        message: "Comment Removed",
        deletedComment,
      });
    } else {
      res.status(301).json({
        message: "not authorized",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed to remove Comment",
      error: err,
    });
  }
});

module.exports = router;
