import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Baby = sequelize.define(
    'Baby',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      birthDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'birth_date' },
      birthTime: { type: DataTypes.TIME, allowNull: true, field: 'birth_time' },
      weightGrams: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'weight_grams' },
      lengthCm: { type: DataTypes.DECIMAL(4, 1), allowNull: true, field: 'length_cm' },
      birthPlace: { type: DataTypes.STRING(150), allowNull: true, field: 'birth_place' },
      birthCity: { type: DataTypes.STRING(100), allowNull: true, field: 'birth_city' },
      description: { type: DataTypes.TEXT, allowNull: true },
    },
    { tableName: 'babies', timestamps: true }
  );
  return Baby;
};
