// models/detail_transaksi.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    static associate(models) {
      this.belongsTo(models.transaksi, { foreignKey: "id_transaksi", as: "transaksi" });
      this.belongsTo(models.menu, { foreignKey: "id_menu", as: "menu" });
    }
  }
  detail_transaksi.init(
    {
      id_detail_transaksi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id_transaksi: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_menu: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      harga: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Sequelize akan secara otomatis menambahkan createdAt dan updatedAt
    },
    {
      sequelize,
      modelName: "detail_transaksi",
      tableName: 'ukk_kafe_detail_transaksi',
      timestamps: true, // Pastikan ini diaktifkan
    }
  );
  return detail_transaksi;
};
