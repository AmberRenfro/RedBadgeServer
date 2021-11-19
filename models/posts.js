const { DataTypes } = require("sequelize");
const db = require("../db");

const Posts = db.define("posts", {
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entry: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
    }
})
module.exports = Posts;