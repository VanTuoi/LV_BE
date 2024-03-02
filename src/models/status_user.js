'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Status_User.belongsTo(models.User, {
        foreignKey: 'U_Id'
      })
    }
  }
  Status_User.init({
    SU_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    SU_Describe: DataTypes.STRING,
    U_Id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Status_User',
  });
  return Status_User;
};