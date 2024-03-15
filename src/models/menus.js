'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menus extends Model {

    static associate(models) {
      Menus.belongsTo(models.Coffee_Store, {
        foreignKey: 'CS_Id',
      })
    }
  }
  Menus.init({
    M_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    M_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 50]
      }
    },
    M_Price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CS_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Menus',
  });
  return Menus;
};