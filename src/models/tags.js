'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {

    static associate(models) {
      Tags.belongsTo(models.Coffee_Store, {
        foreignKey: 'CS_Id',
      })
    }
  }
  Tags.init({
    T_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    T_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    CS_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Tags',
  });
  return Tags;
};