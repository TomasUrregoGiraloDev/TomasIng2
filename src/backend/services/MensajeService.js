import { Op } from 'sequelize';
import { Mensaje, Usuario } from '../models/index.js';
import { HttpError } from '../middlewares/error.js';
import { crearNotificacion } from './NotificacionService.js';

const includeUsuarios = [
  { model: Usuario, as: 'remitente', attributes: ['id_usuario', 'correo_electronico'] },
  { model: Usuario, as: 'destinatario', attributes: ['id_usuario', 'correo_electronico'] },
];

// CU-10 | RF-013 | E13 - listarConversacionesUsuario()
export async function listarConversaciones(id_usuario) {
  const mensajes = await Mensaje.findAll({
    where: {
      [Op.or]: [
        { id_usuario_remitente: id_usuario },
        { id_usuario_destinatario: id_usuario },
      ],
    },
    include: includeUsuarios,
    order: [['fecha_envio', 'DESC']],
  });

  const map = new Map();
  for (const m of mensajes) {
    const otro = m.id_usuario_remitente === id_usuario ? m.destinatario : m.remitente;
    if (!map.has(otro.id_usuario)) {
      map.set(otro.id_usuario, { contraparte: otro, ultimo: m, no_leidos: 0 });
    }
    if (m.id_usuario_destinatario === id_usuario && !m.leido) {
      map.get(otro.id_usuario).no_leidos += 1;
    }
  }
  return Array.from(map.values());
}

// CU-10 | RF-015 | E13 - obtenerConversacion()
export async function obtenerConversacion(id_usuario, id_otro) {
  const mensajes = await Mensaje.findAll({
    where: {
      [Op.or]: [
        { id_usuario_remitente: id_usuario, id_usuario_destinatario: id_otro },
        { id_usuario_remitente: id_otro, id_usuario_destinatario: id_usuario },
      ],
    },
    order: [['fecha_envio', 'ASC']],
  });
  await Mensaje.update(
    { leido: true },
    { where: { id_usuario_remitente: id_otro, id_usuario_destinatario: id_usuario, leido: false } },
  );
  return mensajes;
}

// CU-10 | RF-013 | E13 - enviarMensaje()
export async function enviar(id_usuario, { id_usuario_destinatario, contenido, id_actividad }) {
  if (id_usuario_destinatario === id_usuario) throw new HttpError(400, 'No puedes enviarte mensajes a ti mismo');
  const destinatario = await Usuario.findByPk(id_usuario_destinatario);
  if (!destinatario) throw new HttpError(404, 'Destinatario no existe');

  const mensaje = await Mensaje.create({
    id_usuario_remitente: id_usuario,
    id_usuario_destinatario,
    contenido,
    id_actividad: id_actividad || null,
  });

  await crearNotificacion({
    id_usuario: id_usuario_destinatario,
    tipo: 'MENSAJE_NUEVO',
    titulo: 'Nuevo mensaje',
    mensaje: contenido.length > 80 ? contenido.slice(0, 77) + '...' : contenido,
  });
  return mensaje;
}
