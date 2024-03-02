'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      U_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      U_Name: {
        type: Sequelize.STRING
      },
      U_Password: {
        type: Sequelize.STRING
      },
      U_PhoneNumber: {
        type: Sequelize.STRING
      },
      U_Gender: {
        type: Sequelize.BOOLEAN
      },
      U_Birthday: {
        type: Sequelize.DATE
      },
      U_DateOpening: {
        type: Sequelize.DATE
      },
      U_PrestigeScore: {
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
    await queryInterface.dropTable('User');
  }
};