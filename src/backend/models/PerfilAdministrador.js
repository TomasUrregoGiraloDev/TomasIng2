// ============================================================
// Modelo PerfilAdministrador
// Tabla(s) BD : PERFIL_ADMIN
// HU          : HU16, HU17
// RF          : RF-016, RF-017
// RNF         : RNF-016
// ============================================================
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// E12 - Clase PerfilAdmin
export const PerfilAdmin = sequelize.define('PerfilAdmin', {
  id_admin: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  apellido: { type: DataTypes.STRING(100), allowNull: false },
  nivel_acceso: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'GENERAL' },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false, unique: true },
}, { tableName: 'PERFIL_ADMIN' });

// Alias para compatibilidad
export const PerfilAdministrador = PerfilAdmin;
