'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coffee_Store extends Model {

    static associate(models) {
      Coffee_Store.hasOne(models.Reserve_Ticket, {
        foreignKey: 'CS_Id',
      })
      Coffee_Store.hasMany(models.Activity_Schedule, {
        foreignKey: 'CS_Id',
      })
      Coffee_Store.hasMany(models.Menus, {
        foreignKey: 'CS_Id',
      })
      Coffee_Store.hasMany(models.Tags, {
        foreignKey: 'CS_Id',
      })
      Coffee_Store.hasMany(models.Comments, {
        foreignKey: 'CS_Id',
      })
      Coffee_Store.hasMany(models.Reports, {
        foreignKey: 'CS_Id',
      })
      Coffee_Store.hasMany(models.Status_Coffee_Store, {
        foreignKey: 'CS_Id',
      })
      Coffee_Store.belongsTo(models.Manager, {
        foreignKey: 'M_Id'
      });
      Coffee_Store.belongsToMany(models.Favorites_List, {
        through: 'Favorites_Store', // Tên của bảng trung gian
        foreignKey: 'CS_Id', // Khóa ngoại của Coffee_Store trong bảng trung gian
        otherKey: 'FL_Id', // Khóa ngoại của Favorites_List trong bảng trung gian
      });
    }
  }
  Coffee_Store.init({
    CS_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    BS_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    BS_Location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    BS_Detail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 2000]
      }
    },
    BS_DateOpening: DataTypes.DATE,
    M_Id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Coffee_Store',
  });
  return Coffee_Store;
};