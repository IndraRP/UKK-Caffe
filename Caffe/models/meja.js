'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with the 'transaksi' model
      this.hasMany(models.transaksi, {
        foreignKey: "id_meja", 
        as: "seat" // Alias untuk asosiasi ini
      });
    }
  }

  // Define fields for the 'meja' model
  meja.init({
    id_meja: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nomor_meja: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("kosong", "terisi"),
      allowNull: false,
      defaultValue: "kosong" // Set default value jika diperlukan
    },
  }, {
    sequelize,
    modelName: 'meja',
    tableName: 'ukk_kafe_meja',
    timestamps: true, // Mengaktifkan createdAt dan updatedAt secara otomatis
    createdAt: 'created_at', // Nama kolom untuk createdAt
    updatedAt: 'updated_at'  // Nama kolom untuk updatedAt
  });

  return meja;
};
