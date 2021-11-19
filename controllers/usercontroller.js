const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const { userModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const validateSession = require("../middleware/validate-session");

const router = Router();


router.post("/signup", async function (req, res) {
  
  const {username, email, password, admin} = req.body;
  
  try{
    const User = await userModel.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      admin
    });

    const token = jwt.sign({
      id: User.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 60 * 24
    }
    );

    res.status(200).json({
      message: "Signup Succesful!",
      user: {
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 10),
        sessionToken: token
      },
    });
  
  }catch(e) {
    if (e instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Email or Username already in use.",
        error: e
      });
    } else {
      res.status(500).json({
        message: "Unable to register user.",
        error: e
      });
    }
    
  }
 
});

router.post("/login", async function (req, res) {
  const { email, password } = req.body;
  
  try{
    let loginUser = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (loginUser) {
      let passwordComparison = await bcrypt.compare(password, loginUser.password);

      if (passwordComparison) {
        let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24});

        res.status(200).json({
          user: {
            user: loginUser,
            admin: loginUser.admin,
            sessionToken: token,
            password: password
          },
        });
      } else {
        res.status(401).json({
          message: "Incorrect username or password"
        });
      }
    } else {
      res.status(401).json({
        message: "Incorrect username or password"
      });
    }

  } catch (e) {
    res.status(500).json({
      message: "Login Failed",
      error: e
    })
  }
});

router.put("/edit", validateSession, async (req, res) => {
  const {email, password, username} = req.body;
  const userId = req.user.id;
  
  const query ={
      where: {
          id: userId,
      }
  };

  const updatedLogin = {
      email: email,
      password: bcrypt.hashSync(password, 10),
      username: username,
  };
  
  try {
      const update = await userModel.update(updatedLogin, query);
      res.status(200).json({
          
          message: "Information successfully updated!",
          updatedLogin,
          update
      });
  } catch (err) {
      res.status(500).json({error: err});
  }
});


router.delete("/delete", validateSession, async (req, res) => {
  const userId = req.user.id;
  
  try{
    const query = {
      where: {
        id: userId
      }
    }

    await userModel.destroy(query);
    res.status(200).json({
      message: "Account deleted!"
    });
  } catch (e) {
    res.status(500).json({message: e.message});
  }
});

module.exports = router;
