"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definisikan hubungan dengan model transaksi
      this.hasMany(models.transaksi, {
        foreignKey: "id_user",
        as: "buyMenu",
      });
    }
  }

  // Inisialisasi model user dengan struktur yang diinginkan
  user.init(
    {
      id_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_user: DataTypes.STRING,
      role: DataTypes.ENUM("admin", "manajer", "kasir"),
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
      tableName: "ukk_kafe_user",
    }
  );

  return user;
};
