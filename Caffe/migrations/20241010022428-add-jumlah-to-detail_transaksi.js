// migrations/xxxxxxxxxxxxxx-add-jumlah-to-detail_transaksi.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ukk_kafe_detail_transaksi', 'jumlah', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Atur nilai default sesuai kebutuhan
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ukk_kafe_detail_transaksi', 'jumlah');
  }
};
