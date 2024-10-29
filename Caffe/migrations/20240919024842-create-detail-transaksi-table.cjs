'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ukk_kafe_detail_transaksi', {
      id_detail_transaksi: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      id_transaksi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ukk_kafe_transaksi',
          key: 'id_transaksi'
        }
      },
      id_menu: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ukk_kafe_menu',
          key: 'id_menu'
        }
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ukk_kafe_detail_transaksi');
  }
};
