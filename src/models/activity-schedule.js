'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity_Schedule extends Model {

    static associate(models) {
      Activity_Schedule.belongsTo(models.Coffee_Store, {
        foreignKey: 'CS_Id',
      })
    }
  }
  Activity_Schedule.init({
    AS_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    AS_Holiday: DataTypes.DATE,
    CS_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Activity_Schedule',
  });
  return Activity_Schedule;
};