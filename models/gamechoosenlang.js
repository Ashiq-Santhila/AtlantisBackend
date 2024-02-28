// models/games.js
const { DataTypes } = require("sequelize");
const sequelize = require("../lib/config/database");
const game = require("./game");
const languages = require("./languages");

const lmsGameChoosenLang = sequelize.define(
            "lmsGameChoosenLang",
            {
              gamechoosenId: {
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
             createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
               defaultValue: DataTypes.NOW,              
             },
              
           },
            {
              tableName: "lmsGameChoosenLang", // Specify the table name if it differs from the model name
              freezeTableName: true,
updatedAt: false, // Disable updatedAt
            }
          );
//LmsGame.belongsTo(game, { foreignKey: "gameId", as: "image" });

module.exports = lmsGameChoosenLang;
