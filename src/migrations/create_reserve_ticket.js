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
      RT_BookingDate: {
        type: Sequelize.DATE
      },
      RT_ArrivalTime: {
        type: Sequelize.TIME
      },
      RT_NumberOfParticipants: {
        type: Sequelize.INTEGER
      },
      U_Id: {
        type: Sequelize.INTEGER
      },
      TBS_Id: {
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