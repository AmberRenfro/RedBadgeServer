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

// Edit your comments
router.put("/edit/:entryId", validateSession, async (req, res) => {
  const { comment } = req.body;
  const commentId = req.params.entryId;
  const query = {
    where: {
      id: commentId,
    },
  };
  const updatedComment = {
    comment: comment,
  };
  try {
    const update = await commentsModel.update(updatedComment, query);
    res.status(200).json({
      message: "Comment successfully updated",
      update,
    });
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
  } else if (req.user.admin === false) {
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
      res.status(200).json({
        message: "no entry found",
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
