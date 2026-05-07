import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Resena = sequelize.define('Resena', {
  id_resena: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  calificacion: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comentario: { type: DataTypes.TEXT },
  fecha_resena: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  id_inscripcion: { type: DataTypes.INTEGER, allowNull: false, unique: true },
}, { tableName: 'RESENA' });
