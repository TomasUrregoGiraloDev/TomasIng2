import { Op } from 'sequelize';
import {
  Actividad, Categoria, Ciudad, PerfilOrganizacion, Inscripcion,
} from '../models/index.js';
import { HttpError } from '../middlewares/error.js';

const includeFull = [
  { model: PerfilOrganizacion, as: 'organizacion', attributes: ['id_organizacion', 'nombre_institucion', 'estado_verificacion', 'estado_activo'] },
  { model: Categoria, as: 'categoria' },
  { model: Ciudad, as: 'ciudad' },
];

export async function listar({ q, id_categoria, id_ciudad, fecha, id_organizacion, soloActivas = true } = {}) {
  const where = {};
  if (q) where.titulo = { [Op.like]: `%${q}%` };
  if (id_categoria) where.id_categoria = id_categoria;
  if (id_ciudad) where.id_ciudad = id_ciudad;
  if (fecha) {
    where.fecha_evento = {
      [Op.gte]: new Date(`${fecha}T00:00:00`),
      [Op.lt]: new Date(`${fecha}T23:59:59`),
    };
  }
  if (id_organizacion) where.id_organizacion = id_organizacion;

  const include = [...includeFull];
  if (soloActivas && !id_organizacion) {
    where.estado_actividad = { [Op.notIn]: ['BORRADOR', 'CANCELADA'] };
  }

  const lista = await Actividad.findAll({ where, include, order: [['fecha_evento', 'ASC']] });
  if (soloActivas && !id_organizacion) {
    return lista.filter((a) => a.organizacion?.estado_activo !== false);
  }
  return lista;
}

export async function obtener(id) {
  const act = await Actividad.findByPk(id, { include: includeFull });
  if (!act) throw new HttpError(404, 'Actividad no encontrada');
  return act;
}

async function getOrgVerificadaDelUsuario(id_usuario) {
  const org = await PerfilOrganizacion.findOne({ where: { id_usuario } });
  if (!org) throw new HttpError(403, 'Solo organizaciones pueden hacer esta accion');
  if (org.estado_verificacion !== 'VERIFICADA') {
    throw new HttpError(403, 'Tu organizacion no esta verificada todavia');
  }
  if (org.estado_activo === false) {
    throw new HttpError(403, 'Tu organizacion esta pausada');
  }
  return org;
}

// CU-04 | RF-005 | E13 - publicarActividad()
export async function crear(id_usuario, datos) {
  const org = await getOrgVerificadaDelUsuario(id_usuario);
  const act = await Actividad.create({
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    fecha_evento: datos.fecha_evento,
    direccion: datos.direccion,
    cupos_totales: datos.cupos_totales,
    cupos_disponibles: datos.cupos_totales,
    estado_actividad: 'PUBLICADA',
    imagen_url: datos.imagen_url,
    id_organizacion: org.id_organizacion,
    id_categoria: datos.id_categoria,
    id_ciudad: datos.id_ciudad,
  });
  return obtener(act.id_actividad);
}

// CU-08 | RF-005 | E13 - editarActividad()
export async function actualizar(id_usuario, id, datos) {
  const org = await PerfilOrganizacion.findOne({ where: { id_usuario } });
  const act = await Actividad.findByPk(id);
  if (!act) throw new HttpError(404, 'Actividad no encontrada');
  if (!org || act.id_organizacion !== org.id_organizacion) {
    throw new HttpError(403, 'No puedes modificar esta actividad');
  }
  await act.update(datos);
  return obtener(id);
}

// CU-09 | RF-005 | E13 - cancelarActividad()
export async function cancelar(id_usuario, id) {
  const org = await PerfilOrganizacion.findOne({ where: { id_usuario } });
  const act = await Actividad.findByPk(id);
  if (!act) throw new HttpError(404, 'Actividad no encontrada');
  if (!org || act.id_organizacion !== org.id_organizacion) {
    throw new HttpError(403, 'No puedes cancelar esta actividad');
  }
  await act.update({ estado_actividad: 'CANCELADA' });
  return obtener(id);
}

export async function eliminar(id_usuario, id) {
  const org = await PerfilOrganizacion.findOne({ where: { id_usuario } });
  const act = await Actividad.findByPk(id);
  if (!act) throw new HttpError(404, 'Actividad no encontrada');
  if (!org || act.id_organizacion !== org.id_organizacion) {
    throw new HttpError(403, 'No puedes eliminar esta actividad');
  }
  const tieneInscripciones = await Inscripcion.count({
    where: { id_actividad: id, estado_solicitud: { [Op.in]: ['APROBADA', 'PENDIENTE'] } },
  });
  if (tieneInscripciones > 0) throw new HttpError(409, 'No se puede eliminar una actividad con inscripciones activas');
  await act.destroy();
}
