'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Status_User, {
        foreignKey: 'U_Id'
      });
      User.hasMany(models.Reserve_Ticket, {
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
    U_Name: DataTypes.STRING,
    U_Password: DataTypes.STRING,
    U_PhoneNumber: DataTypes.STRING,
    U_Gender: DataTypes.BOOLEAN,
    U_Birthday: DataTypes.INTEGER,
    U_DateOpening: DataTypes.INTEGER,
    U_PrestigeScore: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};