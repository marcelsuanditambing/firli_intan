import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Gift = sequelize.define(
    'Gift',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      babyId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'baby_id' },
      type: { type: DataTypes.ENUM('qris', 'bank_transfer', 'e_wallet'), allowNull: false },
      providerName: { type: DataTypes.STRING(80), allowNull: false, field: 'provider_name' },
      accountName: { type: DataTypes.STRING(120), allowNull: true, field: 'account_name' },
      accountNumber: { type: DataTypes.STRING(60), allowNull: true, field: 'account_number' },
      qrisImageUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'qris_image_url' },
      note: { type: DataTypes.STRING(255), allowNull: true },
      sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    },
    { tableName: 'gifts', timestamps: true }
  );
  return Gift;
};
