// models/menu.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    static associate(models) {
      this.hasMany(models.detail_transaksi, { foreignKey: 'id_menu', as: 'detail_transaksi' });
    }
  }
  menu.init(
    {
      id_menu: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_menu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      harga: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jenis: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      gambar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "menu",
      tableName: 'ukk_kafe_menu',
      timestamps: false, // Sesuaikan dengan kebutuhan Anda
    }
  );
  return menu;
};
