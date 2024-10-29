'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ukk_kafe_meja', 'status', {
      type: Sequelize.ENUM('kosong', 'terisi'),
      allowNull: false,
      defaultValue: 'kosong'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ukk_kafe_meja', 'status');
  }
};
