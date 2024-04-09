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
      Coffee_Store.hasMany(models.Services, {
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
        through: 'Favorites_List', // Tên của bảng trung gian
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
    CS_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 200]
      }
    },
    CS_Avatar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CS_Location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 200]
      }
    },
    CS_Detail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 20000]
      }
    },
    CS_AcceptOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    CS_MaxPeople: {
      type: DataTypes.INTEGER,
    },
    CS_MaxPeople: {
      type: DataTypes.INTEGER,
    },
    CS_TimeOpen: {
      type: DataTypes.DATE,
    },
    CS_TimeClose: {
      type: DataTypes.DATE,
    },
    M_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Coffee_Store',
  });
  return Coffee_Store;
};