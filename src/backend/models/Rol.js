import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// E12 - Clase Rol
export const Rol = sequelize.define('Rol', {
  id_rol: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre_rol: { type: DataTypes.STRING(50), allowNull: false, unique: true },
}, { tableName: 'ROL' });
