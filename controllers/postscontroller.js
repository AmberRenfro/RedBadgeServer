const { Router } = require("express");
const validateSession = require("../middleware/validate-session");
const { postsModel } = require("../models");

const router = Router()

    // Create 
router.post("/create", validateSession, async (req, res) => {
    const {destination, entry, image} = req.body;
    

    try {
        const newPost = await postsModel.create({
           destination,
           entry,
           image,
           userId: req.user.id,
           owner: req.user.username
        });
        res.status(200).json({
            message: "Post created!",
            newPost
        });
    } catch (err) {
        res.status(500).json({
            message: "oops looks like something went wrong",
            error: err
        });
    };
});

    // Get All Posts
router.get("/", async (req,res) => {
    try {
        const allPosts = await postsModel.findAll();
        res.status(200).json(allPosts);
    } catch (err) {
      res.status(500).json({
          message: `Server error ${err}`
      });
    };
});
    
    // Get My Posts
router.get("/mine", validateSession, async (req,res) => {
    const userId = req.user.id;

    const query = {
        where: {
            userId: userId
        },
    };

    try {
        const myPosts = await postsModel.findAll(query);
        res.status(200).json(myPosts);
    } catch (err) {
        res.status(500).json({
            message: `Server error ${err}`
        });
    };
});


    // Edit My Post 
router.put("/edit/:id", validateSession, async (req,res) => {
    const { destination, entry, image } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: postId,
            userId: userId,
        }
    };

    const updatedPost = {
        destination: destination,
        entry: entry,
        image: image
    };

    try {
        const update = await postsModel.update(updatedPost, query);
        res.status(200).json({
            message: "Post updated succesfully",
            updatedPost,
            update
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    };
});


    // Delete Post
router.delete("/delete/:id", validateSession, async (req,res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    if (req.user.admin === true) {
        query = {
            where: {
                id: postId
            },
        };
    } else {
        query = {
            where: {
                id: postId,
                userId: userId
            },
        };
    };

    try {
        const deletedPost = await postsModel.destroy(query);
        if (deletedPost === 1) {
            res.status(200).json({
                message: "Post has been deleted",
                deletedPost,
            });
        } else if (deletedPost === 0) {
            res.status(200).json({
                message: "You are not authorized"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Server cannot remove your post from the database",
            error: err,
        });
    };
});

module.exports = router;