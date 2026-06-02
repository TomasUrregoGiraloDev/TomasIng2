// ============================================================
// Modelo Usuario
// Tabla(s) BD : USUARIO
// HU          : HU10, HU14
// RF          : RF-001, RF-002, RF-003
// RNF         : RNF-002, RNF-010
// ============================================================
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// E12 - Clase Usuario (entidad central de autenticacion)
export const Usuario = sequelize.define('Usuario', {
  id_usuario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  correo_electronico: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  contrasena: { type: DataTypes.STRING(255), allowNull: false },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  id_rol: { type: DataTypes.INTEGER, allowNull: false },
  id_ciudad: { type: DataTypes.INTEGER },
}, {
  tableName: 'USUARIO',
  defaultScope: { attributes: { exclude: ['contrasena'] } },
  scopes: { withPassword: { attributes: { include: ['contrasena'] } } },
});
