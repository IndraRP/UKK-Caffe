// migrations/xxxxxxxxxxxxxx-add-timestamps-to-detail_transaksi.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ukk_kafe_detail_transaksi', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    await queryInterface.addColumn('ukk_kafe_detail_transaksi', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ukk_kafe_detail_transaksi', 'createdAt');
    await queryInterface.removeColumn('ukk_kafe_detail_transaksi', 'updatedAt');
  }
};
