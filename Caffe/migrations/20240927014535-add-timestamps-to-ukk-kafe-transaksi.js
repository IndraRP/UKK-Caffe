module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ukk_kafe_transaksi', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('ukk_kafe_transaksi', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ukk_kafe_transaksi', 'createdAt');
    await queryInterface.removeColumn('ukk_kafe_transaksi', 'updatedAt');
  }
};
