import { Op } from 'sequelize';
import {
  PerfilOrganizacion, Usuario, Ciudad, Actividad, Inscripcion, Categoria, PerfilVoluntario,
} from '../models/index.js';
import { HttpError } from '../middlewares/error.js';
import { crearNotificacion } from './NotificacionService.js';

// CU-08 + HU16 - Admin lista organizaciones
export async function listarOrganizaciones({ estado, q } = {}) {
  const where = {};
  if (estado) where.estado_verificacion = estado;
  if (q) where.nombre_institucion = { [Op.like]: `%${q}%` };

  const orgs = await PerfilOrganizacion.findAll({
    where,
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'correo_electronico'], include: [{ model: Ciudad, as: 'ciudad' }] },
    ],
    order: [['nombre_institucion', 'ASC']],
  });

  const ids = orgs.map((o) => o.id_organizacion);
  const conteos = ids.length === 0 ? [] : await Actividad.findAll({
    attributes: ['id_organizacion', [Actividad.sequelize.fn('COUNT', Actividad.sequelize.col('id_actividad')), 'total']],
    where: { id_organizacion: { [Op.in]: ids } },
    group: ['id_organizacion'],
    raw: true,
  });
  const mapa = Object.fromEntries(conteos.map((c) => [c.id_organizacion, Number(c.total)]));
  return orgs.map((o) => ({ ...o.toJSON(), total_actividades: mapa[o.id_organizacion] || 0 }));
}

// HU16 - Admin verifica organizaciones
export async function cambiarEstadoOrganizacion(id_organizacion, nuevoEstado) {
  const valid = ['PENDIENTE', 'VERIFICADA', 'SUSPENDIDA'];
  if (!valid.includes(nuevoEstado)) throw new HttpError(400, 'Estado invalido');
  const org = await PerfilOrganizacion.findByPk(id_organizacion, { include: [{ model: Usuario, as: 'usuario' }] });
  if (!org) throw new HttpError(404, 'Organizacion no encontrada');
  await org.update({ estado_verificacion: nuevoEstado });
  if (nuevoEstado === 'VERIFICADA') {
    await crearNotificacion({
      id_usuario: org.usuario.id_usuario,
      tipo: 'ORG_VERIFICADA',
      titulo: 'Tu organizacion fue verificada',
      mensaje: 'Ya puedes publicar actividades en la plataforma',
    });
  }
  return org;
}

// HU17 - Admin elimina contenido
export async function eliminarActividad(id_actividad) {
  const act = await Actividad.findByPk(id_actividad);
  if (!act) throw new HttpError(404, 'Actividad no encontrada');
  await act.destroy();
}

// RF-015 - Estadisticas
export async function obtenerEstadisticas() {
  const [totalActividades, totalInscripciones, totalAprobadas, totalAsistencias, orgs, voluntarios] = await Promise.all([
    Actividad.count(),
    Inscripcion.count(),
    Inscripcion.count({ where: { estado_solicitud: 'APROBADA' } }),
    Inscripcion.count({ where: { estado_solicitud: 'ASISTIO' } }),
    PerfilOrganizacion.count(),
    PerfilVoluntario.count(),
  ]);

  const porCategoria = await Actividad.findAll({
    attributes: [
      [Actividad.sequelize.col('categoria.nombre_categoria'), 'categoria'],
      [Actividad.sequelize.fn('COUNT', Actividad.sequelize.col('Actividad.id_actividad')), 'total'],
    ],
    include: [{ model: Categoria, as: 'categoria', attributes: [] }],
    group: ['categoria.nombre_categoria'],
    raw: true,
  });

  return {
    total_actividades: totalActividades,
    total_inscripciones: totalInscripciones,
    total_aprobadas: totalAprobadas,
    total_asistencias: totalAsistencias,
    total_organizaciones: orgs,
    total_voluntarios: voluntarios,
    actividades_por_categoria: porCategoria.map((p) => ({ categoria: p.categoria, total: Number(p.total) })),
  };
}
