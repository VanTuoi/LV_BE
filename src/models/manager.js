'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manager extends Model {

    static associate(models) {
      Manager.hasMany(models.Status_Manager, {
        foreignKey: 'M_Id'
      });
      Manager.hasOne(models.Coffee_Store, {
        foreignKey: 'M_Id'
      });
    }
  }
  Manager.init({
    M_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    M_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    M_Password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 200]
      }
    },
    M_PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 10]
      }
    },
    M_Gender: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      allowNull: false
    },
    M_Birthday: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Manager',
  });
  return Manager;
};