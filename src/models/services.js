'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Services extends Model {

    static associate(models) {
      Services.belongsTo(models.Coffee_Store, {
        foreignKey: 'CS_Id',
      })
    }
  }
  Services.init({
    S_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    S_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    S_IsAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    S_Describe: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
    },
    CS_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Services',
  });
  return Services;
};