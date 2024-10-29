'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ukk_kafe_menu', {
      id_menu: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nama_menu: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      jenis: {
        type: Sequelize.ENUM('makanan', 'minuman'),
        allowNull: false
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      gambar: {
        type: Sequelize.STRING(255)
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ukk_kafe_menu');
  }
};