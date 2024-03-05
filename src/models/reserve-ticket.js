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
      Reserve_Ticket.belongsTo(models.Coffee_Store, {
        foreignKey: 'CS_Id'
      });
      Reserve_Ticket.hasMany(models.Status_Reserve_Ticket, {
        foreignKey: 'RT_Id'
      });
    }
  }
  Reserve_Ticket.init({
    RT_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    RT_DateTimeArrival: DataTypes.DATE,
    RT_NumberOfParticipants: DataTypes.INTEGER,
    RT_Ip: DataTypes.STRING,
    U_Id: DataTypes.INTEGER,
    CS_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Reserve_Ticket',
  });
  return Reserve_Ticket;
};