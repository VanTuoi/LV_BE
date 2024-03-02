'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorites_List extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Favorites_List.belongsTo(models.User, {
        foreignKey: 'U_Id',
      })
      Favorites_List.belongsToMany(models.Beverage_Store, {
        through: 'favorites_store',
        foreignKey: 'FL_Id', // Khóa ngoại của Favorites_List trong bảng trung gian
        otherKey: 'BS_Id', // Khóa ngoại của Beverage_Store trong bảng trung gian
        as: 'BS_Id' // Biệt danh
      });
    }
  }
  Favorites_List.init({
    FL_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'Favorites_List',
  });
  return Favorites_List;
};