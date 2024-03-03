'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status_Coffee_Store extends Model {

    static associate(models) {
      Status_Coffee_Store.belongsTo(models.Coffee_Store, {
        foreignKey: 'CS_Id'
      });
    }
  }
  Status_Coffee_Store.init({
    SCS_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    SCS_Describe: {
      type: DataTypes.ENUM('Normal', 'Lock'),
      allowNull: false
    },
    CS_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Status_Coffee_Store',
  });
  return Status_Coffee_Store;
};