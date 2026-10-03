import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Wish = sequelize.define(
    'Wish',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      babyId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'baby_id' },
      guestName: { type: DataTypes.STRING(100), allowNull: false, field: 'guest_name' },
      guestRelation: { type: DataTypes.STRING(60), allowNull: true, field: 'guest_relation' },
      message: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
      ipHash: { type: DataTypes.CHAR(64), allowNull: true, field: 'ip_hash' },
    },
    {
      tableName: 'greetings',
      timestamps: true,
      defaultScope: {
        // Never leak the IP hash through the API by default.
        attributes: { exclude: ['ipHash'] },
      },
    }
  );
  return Wish;
};
