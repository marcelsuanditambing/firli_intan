import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Gallery = sequelize.define(
    'Gallery',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      babyId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'baby_id' },
      imageUrl: { type: DataTypes.STRING(255), allowNull: false, field: 'image_url' },
      thumbnailUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'thumbnail_url' },
      caption: { type: DataTypes.STRING(255), allowNull: true },
      altText: { type: DataTypes.STRING(150), allowNull: true, field: 'alt_text' },
      sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_featured' },
      isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_published' },
    },
    { tableName: 'gallery_photos', timestamps: true }
  );
  return Gallery;
};
