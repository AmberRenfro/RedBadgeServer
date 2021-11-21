const { DataTypes } = require("sequelize");
const db = require("../db");

const Posts = db.define("posts", {
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entry: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
module.exports = Posts;