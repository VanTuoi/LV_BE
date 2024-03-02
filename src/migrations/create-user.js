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
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      U_Password: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      U_PhoneNumber: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      U_Gender: {
        type: Sequelize.ENUM('M', 'F', 'O'),
        allowNull: false
      },
      U_Birthday: {
        type: Sequelize.DATE
      },
      U_DateOpening: {
        type: Sequelize.DATE
      },
      U_PrestigeScore: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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