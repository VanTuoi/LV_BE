'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Manager', {
      M_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      M_Name: {
        type: Sequelize.STRING(50)
      },
      M_Password: {
        type: Sequelize.STRING(200)
      },
      M_PhoneNumber: {
        type: Sequelize.STRING(10)
      },
      M_Email: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      M_Gender: {
        type: Sequelize.ENUM('M', 'F', 'O'),
        allowNull: false
      },
      M_Birthday: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Manager');
  }
};