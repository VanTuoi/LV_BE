'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reserve_Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reserve_Ticket.belongsTo(models.User, {
        foreignKey: 'U_Id'
      });
      Reserve_Ticket.belongsTo(models.Table_Booking_Schedule, {
        foreignKey: 'TBS_Id'
      });
    }
  }
  Reserve_Ticket.init({
    RT_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    RT_BookingDate: DataTypes.DATE,
    RT_ArrivalTime: DataTypes.TIME,
    RT_NumberOfParticipants: DataTypes.INTEGER,
    U_Id: DataTypes.STRING,
    TBS_Id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Reserve_Ticket',
  });
  return Reserve_Ticket;
};