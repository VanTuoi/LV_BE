'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Table_Booking_Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Table_Booking_Schedule.hasMany(models.Reserve_Ticket, {
        foreignKey: 'TBS_Id'
      })
      Table_Booking_Schedule.belongsTo(models.Beverage_Store, {
        foreignKey: 'BS_Id'
      })
    }
  }
  Table_Booking_Schedule.init({
    TBS_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    BS_Id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Table_Booking_Schedule',
  });
  return Table_Booking_Schedule;
};