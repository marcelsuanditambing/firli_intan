import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Visitor = sequelize.define(
    'Visitor',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      babyId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'baby_id' },
      sessionId: { type: DataTypes.CHAR(36), allowNull: true, field: 'session_id' },
      ipHash: { type: DataTypes.CHAR(64), allowNull: true, field: 'ip_hash' },
      userAgent: { type: DataTypes.STRING(255), allowNull: true, field: 'user_agent' },
      referrer: { type: DataTypes.STRING(255), allowNull: true },
      pagePath: { type: DataTypes.STRING(150), allowNull: true, field: 'page_path' },
      country: { type: DataTypes.STRING(60), allowNull: true },
      visitedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'visited_at' },
    },
    { tableName: 'visitor_logs', timestamps: false }
  );
  return Visitor;
};
