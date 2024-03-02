'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Status_User, {
        foreignKey: 'U_Id'
      });
      User.hasMany(models.Reserve_Ticket, {
        foreignKey: 'U_Id',
      });
      User.hasMany(models.Comments, {
        foreignKey: 'U_Id',
      });
      User.hasMany(models.Reports, {
        foreignKey: 'U_Id',
      });
      User.hasOne(models.Favorites_List, {
        foreignKey: 'U_Id',
      })
    }
  }
  User.init({
    U_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    U_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    U_Password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 20]
      }
    },
    U_PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 10]
      }
    },
    U_Gender: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      allowNull: false
    },
    U_Birthday: DataTypes.DATE,
    U_DateOpening: DataTypes.DATE,
    U_PrestigeScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};