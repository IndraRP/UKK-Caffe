'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ukk_kafe_transaksi', {
      id_transaksi: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      tgl_transaksi: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ukk_kafe_user',
          key: 'id_user'
        }
      },

      id_meja: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ukk_kafe_meja',
          key: 'id_meja'
        }
      },
      nama_pelanggan: {
        type: Sequelize.STRING(100)
      },
      status: {
        type: Sequelize.ENUM('belum_bayar', 'lunas'),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ukk_kafe_transaksi');
  }
};