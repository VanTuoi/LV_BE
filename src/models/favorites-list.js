'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorites_List extends Model {

    static associate(models) {
      Favorites_List.belongsTo(models.User, {
        foreignKey: 'U_Id',
      })
      Favorites_List.belongsToMany(models.Coffee_Store, {
        through: 'Favorites_List',
        foreignKey: 'FL_Id', // Khóa ngoại của Favorites_List trong bảng trung gian
        otherKey: 'CS_Id', // Khóa ngoại của Coffee_Store trong bảng trung gian
      });
    }
  }
  Favorites_List.init({
    FL_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    CS_Id: DataTypes.INTEGER,
    U_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Favorites_List',
  });
  return Favorites_List;
};