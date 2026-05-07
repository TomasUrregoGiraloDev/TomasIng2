import { sequelize } from '../config/db.js';

import { Rol } from './Rol.js';
import { Ciudad } from './Ciudad.js';
import { Categoria } from './Categoria.js';
import { Usuario } from './Usuario.js';
import { PerfilVoluntario } from './PerfilVoluntario.js';
import { PerfilOrganizacion } from './PerfilOrganizacion.js';
import { PerfilAdmin } from './PerfilAdministrador.js';
import { Actividad } from './Actividad.js';
import { Inscripcion } from './Inscripcion.js';
import { Resena } from './Resena.js';
import { Mensaje } from './Mensaje.js';
import { Notificacion } from './Notificacion.js';

// USUARIO
Rol.hasMany(Usuario, { foreignKey: 'id_rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });
Ciudad.hasMany(Usuario, { foreignKey: 'id_ciudad' });
Usuario.belongsTo(Ciudad, { foreignKey: 'id_ciudad', as: 'ciudad' });

// PERFILES (1:1 con USUARIO)
Usuario.hasOne(PerfilVoluntario, { foreignKey: 'id_usuario', as: 'perfilVoluntario' });
PerfilVoluntario.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasOne(PerfilOrganizacion, { foreignKey: 'id_usuario', as: 'perfilOrganizacion' });
PerfilOrganizacion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasOne(PerfilAdmin, { foreignKey: 'id_usuario', as: 'perfilAdmin' });
PerfilAdmin.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// ACTIVIDAD
PerfilOrganizacion.hasMany(Actividad, { foreignKey: 'id_organizacion', as: 'actividades' });
Actividad.belongsTo(PerfilOrganizacion, { foreignKey: 'id_organizacion', as: 'organizacion' });
Categoria.hasMany(Actividad, { foreignKey: 'id_categoria' });
Actividad.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Ciudad.hasMany(Actividad, { foreignKey: 'id_ciudad' });
Actividad.belongsTo(Ciudad, { foreignKey: 'id_ciudad', as: 'ciudad' });

// INSCRIPCION
PerfilVoluntario.hasMany(Inscripcion, { foreignKey: 'id_voluntario', as: 'inscripciones' });
Inscripcion.belongsTo(PerfilVoluntario, { foreignKey: 'id_voluntario', as: 'voluntario' });
Actividad.hasMany(Inscripcion, { foreignKey: 'id_actividad', as: 'inscripciones' });
Inscripcion.belongsTo(Actividad, { foreignKey: 'id_actividad', as: 'actividad' });

// RESENA - una inscripcion puede tener varias reseñas (ver DECISIONES.md #09)
Inscripcion.hasMany(Resena, { foreignKey: 'id_inscripcion', as: 'resenas' });
Resena.belongsTo(Inscripcion, { foreignKey: 'id_inscripcion', as: 'inscripcion' });

// MENSAJE
Usuario.hasMany(Mensaje, { foreignKey: 'id_usuario_remitente', as: 'mensajesEnviados' });
Usuario.hasMany(Mensaje, { foreignKey: 'id_usuario_destinatario', as: 'mensajesRecibidos' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_usuario_remitente', as: 'remitente' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_usuario_destinatario', as: 'destinatario' });
Actividad.hasMany(Mensaje, { foreignKey: 'id_actividad' });
Mensaje.belongsTo(Actividad, { foreignKey: 'id_actividad', as: 'actividad' });

// NOTIFICACION
Usuario.hasMany(Notificacion, { foreignKey: 'id_usuario', as: 'notificaciones' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

export {
  sequelize,
  Rol,
  Ciudad,
  Categoria,
  Usuario,
  PerfilVoluntario,
  PerfilOrganizacion,
  PerfilAdmin,
  Actividad,
  Inscripcion,
  Resena,
  Mensaje,
  Notificacion,
};
