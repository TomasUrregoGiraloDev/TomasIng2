// ============================================================
// Modelo Ciudad
// Tabla(s) BD : CIUDAD
// HU          : HU01, HU10
// RF          : RF-001, RF-006
// ============================================================
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Ciudad = sequelize.define('Ciudad', {
  id_ciudad: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre_ciudad: { type: DataTypes.STRING(100), allowNull: false },
  departamento: { type: DataTypes.STRING(100) },
}, { tableName: 'CIUDAD' });
