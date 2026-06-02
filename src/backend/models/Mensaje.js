// ============================================================
// Modelo Mensaje
// Tabla(s) BD : MENSAJE
// HU          : HU08, HU15
// RF          : RF-012, RF-013
// RNF         : RNF-015
// ============================================================
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// E12 - Clase Mensaje
export const Mensaje = sequelize.define('Mensaje', {
  id_mensaje: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  fecha_envio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false },
  id_usuario_remitente: { type: DataTypes.INTEGER, allowNull: false },
  id_usuario_destinatario: { type: DataTypes.INTEGER, allowNull: false },
  id_actividad: { type: DataTypes.INTEGER },
}, { tableName: 'MENSAJE' });
