import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// E12 - Clase PerfilOrganizacion
export const PerfilOrganizacion = sequelize.define('PerfilOrganizacion', {
  id_organizacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre_institucion: { type: DataTypes.STRING(150), allowNull: false },
  nit_registro: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  telefono: { type: DataTypes.STRING(20) },
  descripcion_org: { type: DataTypes.TEXT },
  estado_activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  estado_verificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'PENDIENTE',
  },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false, unique: true },
}, { tableName: 'PERFIL_ORGANIZACION' });
