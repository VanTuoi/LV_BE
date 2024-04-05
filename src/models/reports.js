'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reports.belongsTo(models.User, {
        foreignKey: 'U_Id'
      });
      Reports.belongsTo(models.Coffee_Store, {
        foreignKey: 'CS_Id'
      });
    }
  }
  Reports.init({
    R_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    R_Details: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 200]
      }
    },
    R_Feedback: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
    },
    R_Status: {
      type: DataTypes.ENUM('Pending', 'Processed'),
      allowNull: false
    },
    U_Id: DataTypes.INTEGER,
    CS_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Reports',
  });
  return Reports;
};