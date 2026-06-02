// ============================================================
// Modelo Notificacion
// Tabla(s) BD : NOTIFICACION
// HU          : HU07, HU11
// RF          : RF-010, RF-011
// RNF         : RNF-007, RNF-008
// ============================================================
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// E12 - Clase Notificacion
export const Notificacion = sequelize.define('Notificacion', {
  id_notificacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  mensaje: { type: DataTypes.STRING(500), allowNull: false },
  tipo: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'GENERAL' },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'NOTIFICACION' });
