'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status_Manager extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Status_Manager.belongsTo(models.Manager, {
        foreignKey: 'M_Id'
      })
    }
  }
  Status_Manager.init({
    SM_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    SM_Describe: {
      type: DataTypes.ENUM('Normal', 'Lock'),
      allowNull: false
    },
    M_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Status_Manager',
  });

  return Status_Manager;
};