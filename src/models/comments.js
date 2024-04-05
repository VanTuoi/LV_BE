'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comments.belongsTo(models.User, {
        foreignKey: 'U_Id'
      });
      Comments.belongsTo(models.Coffee_Store, {
        foreignKey: 'CS_Id'
      });
    }
  }
  Comments.init({
    C_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    C_Details: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
    },
    C_StarsNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    U_Id: DataTypes.INTEGER,
    CS_Id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};