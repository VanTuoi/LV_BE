'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Services', {
      S_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      S_Name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      S_IsAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      S_Describe: {
        allowNull: true,
        type: Sequelize.STRING(200)
      },
      CS_ID: {
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
    await queryInterface.dropTable('Services');
  }
};