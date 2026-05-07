import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Categoria = sequelize.define('Categoria', {
  id_categoria: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre_categoria: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  descripcion: { type: DataTypes.STRING(255) },
}, { tableName: 'CATEGORIA' });
