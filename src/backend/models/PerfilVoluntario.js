import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// E12 - Clase PerfilVoluntario
export const PerfilVoluntario = sequelize.define('PerfilVoluntario', {
  id_voluntario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  apellido: { type: DataTypes.STRING(100), allowNull: false },
  telefono: { type: DataTypes.STRING(20) },
  intereses: { type: DataTypes.TEXT },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false, unique: true },
}, { tableName: 'PERFIL_VOLUNTARIO' });
