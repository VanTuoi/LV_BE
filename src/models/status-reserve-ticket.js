'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status_Reserve_Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Status_Reserve_Ticket.belongsTo(models.Reserve_Ticket, {
        foreignKey: 'RT_Id'
      });
    }
  }
  Status_Reserve_Ticket.init({
    SRT_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    SRT_Describe: {
      type: DataTypes.ENUM('Waiting', 'Has Arrived', 'Late'),
      allowNull: false
    },
    RT_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Status_Reserve_Ticket',
  });
  return Status_Reserve_Ticket;
};