'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Menambahkan kolom createdAt pada tabel users
    await queryInterface.addColumn('ukk_kafe_user', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, // nilai default waktu saat ini
    });

    // Menambahkan kolom updatedAt pada tabel users
    await queryInterface.addColumn('ukk_kafe_user', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, // nilai default waktu saat ini
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus kolom createdAt dari tabel users
    await queryInterface.removeColumn('ukk_kafe_user', 'createdAt');

    // Menghapus kolom updatedAt dari tabel users
    await queryInterface.removeColumn('ukk_kafe_user', 'updatedAt');
  }
};
