'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      R_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      R_Details: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      R_Feedback: {
        allowNull: true,
        type: Sequelize.STRING(200)
      },
      R_Status: {
        allowNull: false,
        type: Sequelize.ENUM('Pending', 'Processed'),
      },
      U_Id: {
        type: Sequelize.INTEGER
      },
      CS_Id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reports');
  }
};