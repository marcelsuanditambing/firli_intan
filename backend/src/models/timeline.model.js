import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Timeline = sequelize.define(
    'Timeline',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      babyId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'baby_id' },
      title: { type: DataTypes.STRING(150), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      eventDate: { type: DataTypes.DATEONLY, allowNull: true, field: 'event_date' },
      weekNumber: { type: DataTypes.TINYINT.UNSIGNED, allowNull: true, field: 'week_number' },
      imageUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'image_url' },
      sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' },
    },
    { tableName: 'pregnancy_timeline', timestamps: true }
  );
  return Timeline;
};
