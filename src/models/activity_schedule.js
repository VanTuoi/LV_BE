'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity_Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Activity_Schedule.belongsTo(models.Beverage_Store, {
        foreignKey: 'BS_Id',
      })
    }
  }
  Activity_Schedule.init({
    AS_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    AS_Holiday: DataTypes.DATE,
    BS_Id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Activity_Schedule',
  });
  return Activity_Schedule;
};