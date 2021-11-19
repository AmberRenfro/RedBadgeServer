const userModel = require("./user");
const postsModel = require("./posts")
const commentsModel = require("./comments")
// create individual files for your models and import them here

//Setup Associations
userModel.hasMany(postsModel);
userModel.hasMany(commentsModel);

postsModel.belongsTo(userModel);
postsModel.hasMany(commentsModel);

commentsModel.belongsTo(postsModel);
commentsModel.belongsTo(userModel);

module.exports = {
  userModel,
  postsModel,
  commentsModel
};
