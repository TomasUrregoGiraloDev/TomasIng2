// ============================================================
// Modelo Inscripcion
// Tabla(s) BD : INSCRIPCION
// HU          : HU03, HU06
// RF          : RF-007, RF-008, RF-009
// RNF         : RNF-003, RNF-006
// ============================================================
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Inscripcion = sequelize.define('Inscripcion', {
  id_inscripcion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fecha_inscripcion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  estado_solicitud: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'PENDIENTE' },
  horas_acreditadas: { type: DataTypes.INTEGER, defaultValue: 0 },
  id_voluntario: { type: DataTypes.INTEGER, allowNull: false },
  id_actividad: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'INSCRIPCION',
  indexes: [{ unique: true, fields: ['id_voluntario', 'id_actividad'] }],
});
