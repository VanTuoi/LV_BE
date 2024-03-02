'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Beverage_Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Beverage_Store.hasOne(models.Table_Booking_Schedule, {
        foreignKey: 'BS_Id',
      })
      Beverage_Store.hasMany(models.Activity_Schedule, {
        foreignKey: 'BS_Id',
      })
      Beverage_Store.belongsToMany(models.Favorites_List, {
        through: 'favorites_store',
        foreignKey: 'BS_Id', // Khóa ngoại của Beverage_Store trong bảng trung gian
        otherKey: 'FL_Id', // Khóa ngoại của Favorites_List trong bảng trung gian
      });
    }
  }
  Beverage_Store.init({
    BS_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    BS_Name: DataTypes.STRING,
    BS_Location: DataTypes.STRING,
    BS_Detail: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Beverage_Store',
  });
  return Beverage_Store;
};