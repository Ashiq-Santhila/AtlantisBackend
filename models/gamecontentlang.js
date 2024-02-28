// models/games.js
const { DataTypes } = require("sequelize");
const sequelize = require("../lib/config/database");
const game = require("./game");
const languages = require("./languages");

const lmsGameContentLang = sequelize.define(
            "lmsGameContentLang",
            {
              gamecontentId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
              },
              gameId: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
               translationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
              tblName: {
                 type: DataTypes.STRING(100),
                allowNull: false,
              },
              feildName:{
                type: DataTypes.STRING(50),
                allowNull: false,
              },
              textId: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
              content:{
                 type: DataTypes.STRING(250),
                 allowNull: false,
              },            
             createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,              
             },
              
           },
            {
              tableName: "lmsGameContentLang", // Specify the table name if it differs from the model name
              freezeTableName: true,
              updatedAt: false, // Disable updatedAt
            }
          );
//LmsGame.belongsTo(game, { foreignKey: "gameId", as: "image" });

module.exports = lmsGameContentLang;
