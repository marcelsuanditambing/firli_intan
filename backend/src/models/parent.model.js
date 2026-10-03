import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Parent = sequelize.define(
    'Parent',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      babyId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'baby_id' },
      role: { type: DataTypes.ENUM('mother', 'father', 'guardian', 'doctor'), allowNull: false },
      fullName: { type: DataTypes.STRING(100), allowNull: false, field: 'full_name' },
      nickname: { type: DataTypes.STRING(50), allowNull: true },
      photoUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'photo_url' },
      bio: { type: DataTypes.TEXT, allowNull: true },
      instagramHandle: { type: DataTypes.STRING(50), allowNull: true, field: 'instagram_handle' },
      sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' },
    },
    { tableName: 'parents', timestamps: true }
  );
  return Parent;
};
