import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Music = sequelize.define(
    'Music',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      babyId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'baby_id' },
      title: { type: DataTypes.STRING(150), allowNull: false },
      artist: { type: DataTypes.STRING(100), allowNull: true },
      fileUrl: { type: DataTypes.STRING(255), allowNull: false, field: 'file_url' },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_active' },
      sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' },
    },
    { tableName: 'music_tracks', timestamps: true }
  );
  return Music;
};
