const { DataTypes } = require("sequelize");
const db = require("../db");

const Comments = db.define("comments", {
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Comments;