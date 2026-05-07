import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Actividad = sequelize.define('Actividad', {
  id_actividad: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  fecha_evento: { type: DataTypes.DATE, allowNull: false },
  direccion: { type: DataTypes.STRING(200) },
  cupos_totales: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  cupos_disponibles: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  estado_actividad: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'PUBLICADA' },
  imagen_url: { type: DataTypes.TEXT('long') },
  id_organizacion: { type: DataTypes.INTEGER, allowNull: false },
  id_categoria: { type: DataTypes.INTEGER, allowNull: false },
  id_ciudad: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'ACTIVIDAD' });
