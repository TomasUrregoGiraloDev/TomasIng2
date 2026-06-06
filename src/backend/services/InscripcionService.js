// ============================================================
// Servicio InscripcionService
// Tabla(s) BD : INSCRIPCION, ACTIVIDAD
// HU          : HU03, HU05, HU06
// RF          : RF-007, RF-008, RF-009
// RNF         : RNF-003, RNF-006
// ============================================================
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

// CU-02 | RF-007 | E13 - crear() | Doc E12: Voluntario.inscribirse()
export async function crear(id_usuario, { id_actividad }) {
  const voluntario = await getVoluntarioByUsuario(id_usuario);
  return sequelize.transaction(async (t) => {
    const actividad = await Actividad.findByPk(id_actividad, { transaction: t, lock: t.LOCK.UPDATE });
    if (!actividad) throw new HttpError(404, 'Actividad no encontrada');
    // RN-01 | CU-02 | RF-007 | HU03 — no se puede inscribir a una actividad cancelada
    if (actividad.estado_actividad === 'CANCELADA') throw new HttpError(409, 'Esta actividad fue cancelada');
    // RN-02 | CU-02 | RF-007 | HU03 | RNF-003 — RF-007 exige restar 1 cupo al inscribirse; si no hay cupos la inscripcion no procede
    if (actividad.cupos_disponibles <= 0) throw new HttpError(409, 'No hay cupos disponibles');

    const existente = await Inscripcion.findOne({
      where: { id_voluntario: voluntario.id_voluntario, id_actividad },
      transaction: t,
    });
    // RN-03 | CU-02 | RF-007 | HU03 — un voluntario no puede tener dos inscripciones activas en la misma actividad
    if (existente) throw new HttpError(409, 'Ya estas inscrito en esta actividad');

    return Inscripcion.create(
      { id_voluntario: voluntario.id_voluntario, id_actividad, estado_solicitud: 'PENDIENTE' },
      { transaction: t },
    );
  });
}

// CU-05 | RF-008 | E13 - listar() | Doc E12: Voluntario.consultarHistorial()
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

// CU-07 | RF-009 | E13 - cambiarEstado() | Doc E12: Organizacion.gestionarInscritos()
export async function cambiarEstado(id_usuario, rol, id_inscripcion, nuevoEstado) {
  // RN-04 | CU-07 | RF-009 | HU06 — solo se aceptan los estados definidos en el modelo de datos (doc. seccion normalizacion)
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

    // RN-05 | CU-07 | RF-009 | HU06 — solo la organizacion duena de la actividad o un ADMIN puede gestionar sus inscripciones
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

    // RN-06 | CU-07 | RF-007 + RF-009 | HU06 — al aprobar se descuenta 1 cupo disponible (RF-007 define que la inscripcion resta cupos)
    if (nuevoEstado === 'APROBADA' && eraPendiente) {
      const act = await Actividad.findByPk(ins.id_actividad, { transaction: t, lock: t.LOCK.UPDATE });
      if (act.cupos_disponibles <= 0) throw new HttpError(409, 'Sin cupos disponibles');
      await act.update({ cupos_disponibles: act.cupos_disponibles - 1 }, { transaction: t });
    }
    // RN-07 | CU-07 | RF-009 | HU06 — al rechazar una inscripcion que ya estaba aprobada, se devuelve el cupo sin superar el total
    if (nuevoEstado === 'RECHAZADA' && eraAprobada) {
      const act = await Actividad.findByPk(ins.id_actividad, { transaction: t });
      await act.update(
        { cupos_disponibles: Math.min(act.cupos_totales, act.cupos_disponibles + 1) },
        { transaction: t },
      );
    }

    await ins.update({ estado_solicitud: nuevoEstado }, { transaction: t });

    // RN-08 | CU-07 | RF-010 | HU07 — RF-010 exige notificar al voluntario cuando su inscripcion cambia de estado
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
