import { Op } from 'sequelize';
import {
  sequelize, Inscripcion, Actividad, PerfilVoluntario, PerfilOrganizacion, Categoria, Ciudad,
} from '../models/index.js';
import { HttpError } from '../middlewares/error.js';
import { crearNotificacion } from './NotificacionService.js';

const includeFull = [
  {
    model: Actividad, as: 'actividad',
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Ciudad, as: 'ciudad' },
      { model: PerfilOrganizacion, as: 'organizacion', attributes: ['id_organizacion', 'nombre_institucion', 'id_usuario'] },
    ],
  },
  { model: PerfilVoluntario, as: 'voluntario' },
];

async function getVoluntarioByUsuario(id_usuario) {
  const v = await PerfilVoluntario.findOne({ where: { id_usuario } });
  if (!v) throw new HttpError(403, 'Solo voluntarios pueden hacer esta accion');
  return v;
}

async function getOrgByUsuario(id_usuario) {
  return PerfilOrganizacion.findOne({ where: { id_usuario } });
}

// CU-02 | RF-007 | E13 - inscribirseActividad()
export async function crear(id_usuario, { id_actividad }) {
  const voluntario = await getVoluntarioByUsuario(id_usuario);
  return sequelize.transaction(async (t) => {
    const actividad = await Actividad.findByPk(id_actividad, { transaction: t, lock: t.LOCK.UPDATE });
    if (!actividad) throw new HttpError(404, 'Actividad no encontrada');
    if (actividad.estado_actividad === 'CANCELADA') throw new HttpError(409, 'Esta actividad fue cancelada');
    if (actividad.cupos_disponibles <= 0) throw new HttpError(409, 'No hay cupos disponibles');

    const existente = await Inscripcion.findOne({
      where: { id_voluntario: voluntario.id_voluntario, id_actividad },
      transaction: t,
    });
    if (existente) throw new HttpError(409, 'Ya estas inscrito en esta actividad');

    return Inscripcion.create(
      { id_voluntario: voluntario.id_voluntario, id_actividad, estado_solicitud: 'PENDIENTE' },
      { transaction: t },
    );
  });
}

// CU-05 | RF-008 | E13 - listarInscripciones()
export async function listar(id_usuario, rol, { estado, id_actividad } = {}) {
  const where = {};
  if (estado) where.estado_solicitud = estado;
  if (id_actividad) where.id_actividad = id_actividad;

  if (rol === 'VOLUNTARIO') {
    const v = await getVoluntarioByUsuario(id_usuario);
    where.id_voluntario = v.id_voluntario;
    return Inscripcion.findAll({ where, include: includeFull, order: [['fecha_inscripcion', 'DESC']] });
  }

  if (rol === 'ORGANIZACION') {
    const org = await getOrgByUsuario(id_usuario);
    if (!org) return [];
    const acts = await Actividad.findAll({ where: { id_organizacion: org.id_organizacion }, attributes: ['id_actividad'] });
    const ids = acts.map((a) => a.id_actividad);
    if (ids.length === 0) return [];
    return Inscripcion.findAll({
      where: { ...where, id_actividad: id_actividad || { [Op.in]: ids } },
      include: includeFull,
      order: [['fecha_inscripcion', 'DESC']],
    });
  }

  return Inscripcion.findAll({ where, include: includeFull, order: [['fecha_inscripcion', 'DESC']] });
}

// CU-07 | RF-009 | E13 - cambiarEstadoInscripcion()
// Regla: al APROBAR decrementa cupos_disponibles y notifica al voluntario.
export async function cambiarEstado(id_usuario, rol, id_inscripcion, nuevoEstado) {
  const valid = ['APROBADA', 'RECHAZADA', 'ASISTIO', 'NO_ASISTIO'];
  if (!valid.includes(nuevoEstado)) throw new HttpError(400, 'Estado invalido');

  return sequelize.transaction(async (t) => {
    const ins = await Inscripcion.findByPk(id_inscripcion, {
      include: [
        { model: Actividad, as: 'actividad', include: [{ model: PerfilOrganizacion, as: 'organizacion' }] },
        { model: PerfilVoluntario, as: 'voluntario' },
      ],
      transaction: t, lock: t.LOCK.UPDATE,
    });
    if (!ins) throw new HttpError(404, 'Inscripcion no encontrada');

    if (rol === 'ORGANIZACION') {
      const org = await getOrgByUsuario(id_usuario);
      if (!org || ins.actividad.id_organizacion !== org.id_organizacion) {
        throw new HttpError(403, 'No puedes modificar esta inscripcion');
      }
    } else if (rol !== 'ADMIN') {
      throw new HttpError(403, 'Permiso denegado');
    }

    const eraPendiente = ins.estado_solicitud === 'PENDIENTE';
    const eraAprobada = ins.estado_solicitud === 'APROBADA';

    if (nuevoEstado === 'APROBADA' && eraPendiente) {
      const act = await Actividad.findByPk(ins.id_actividad, { transaction: t, lock: t.LOCK.UPDATE });
      if (act.cupos_disponibles <= 0) throw new HttpError(409, 'Sin cupos disponibles');
      await act.update({ cupos_disponibles: act.cupos_disponibles - 1 }, { transaction: t });
    }
    if (nuevoEstado === 'RECHAZADA' && eraAprobada) {
      const act = await Actividad.findByPk(ins.id_actividad, { transaction: t });
      await act.update(
        { cupos_disponibles: Math.min(act.cupos_totales, act.cupos_disponibles + 1) },
        { transaction: t },
      );
    }

    await ins.update({ estado_solicitud: nuevoEstado }, { transaction: t });

    const id_usuario_voluntario = ins.voluntario.id_usuario;
    if (nuevoEstado === 'APROBADA') {
      await crearNotificacion({
        id_usuario: id_usuario_voluntario,
        tipo: 'INSCRIPCION_APROBADA',
        titulo: 'Inscripcion aprobada',
        mensaje: `Fuiste aceptado en "${ins.actividad.titulo}"`,
      });
    } else if (nuevoEstado === 'RECHAZADA') {
      await crearNotificacion({
        id_usuario: id_usuario_voluntario,
        tipo: 'INSCRIPCION_RECHAZADA',
        titulo: 'Inscripcion rechazada',
        mensaje: `Tu inscripcion a "${ins.actividad.titulo}" fue rechazada`,
      });
    }

    return ins.reload({ include: includeFull, transaction: t });
  });
}
