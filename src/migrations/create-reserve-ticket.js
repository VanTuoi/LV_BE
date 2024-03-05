'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reserve_Ticket', {
      RT_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RT_DateTimeArrival: {
        allowNull: false,
        type: Sequelize.DATE
      },
      RT_NumberOfParticipants: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      RT_Ip: {
        allowNull: true,
        type: Sequelize.STRING
      },
      U_Id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      CS_Id: {
        allowNull: false,
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
    await queryInterface.dropTable('Reserve_Ticket');
  }
};