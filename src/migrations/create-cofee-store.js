'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coffee_Store', {
      CS_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CS_Name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      CS_Location: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      CS_Detail: {
        allowNull: false,
        type: Sequelize.STRING(20000)
      },
      CS_DateOpening: {
        type: Sequelize.DATE
      },
      M_Id: {
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
    await queryInterface.dropTable('Coffee_Store');
  }
};