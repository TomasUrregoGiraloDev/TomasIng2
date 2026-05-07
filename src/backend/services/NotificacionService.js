import { Notificacion } from '../models/index.js';
import { HttpError } from '../middlewares/error.js';

// CU-10 | RF-010 | E13 - crearNotificacion()
export async function crearNotificacion({ id_usuario, tipo, titulo, mensaje }) {
  return Notificacion.create({ id_usuario, tipo, titulo, mensaje });
}

// CU-10 | RF-010 | E13 - listarNotificacionesUsuario()
export async function listarPorUsuario(id_usuario) {
  return Notificacion.findAll({ where: { id_usuario }, order: [['fecha_creacion', 'DESC']] });
}

// CU-10 | RF-010 | E13 - marcarLeida()
export async function marcarLeida(id_usuario, id_notificacion) {
  const notif = await Notificacion.findByPk(id_notificacion);
  if (!notif) throw new HttpError(404, 'Notificacion no encontrada');
  if (notif.id_usuario !== id_usuario) throw new HttpError(403, 'Sin permiso');
  await notif.update({ leido: true });
  return notif;
}
