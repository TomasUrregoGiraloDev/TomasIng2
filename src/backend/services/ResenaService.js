// ============================================================
// Servicio ResenaService
// Tabla(s) BD : RESENA, INSCRIPCION
// HU          : HU09
// RF          : RF-014
// RNF         : RNF-009
// ============================================================
import { Resena, Inscripcion, PerfilVoluntario } from '../models/index.js';
import { HttpError } from '../middlewares/error.js';

// CU-06 | RF-014 | E13 - registrarResena()
// Permite multiples reseñas por inscripcion (ver DECISIONES.md #09).
export async function crear(id_usuario, { id_inscripcion, calificacion, comentario }) {
  const ins = await Inscripcion.findByPk(id_inscripcion, {
    include: [{ model: PerfilVoluntario, as: 'voluntario' }],
  });
  if (!ins) throw new HttpError(404, 'Inscripcion no encontrada');
  // RN-09 | CU-06 | RF-014 | HU09 — solo el voluntario titular de la inscripcion puede dejar la reseña
  if (ins.voluntario.id_usuario !== id_usuario) {
    throw new HttpError(403, 'No puedes reseñar esta inscripcion');
  }
  // RN-10 | CU-06 | RF-014 | HU09 | RNF-009 — RF-014 + RNF-009 exigen que la reseña solo sea valida si el voluntario efectivamente asistio
  if (ins.estado_solicitud !== 'ASISTIO') {
    throw new HttpError(409, 'Solo puedes reseñar despues de asistir');
  }
  return Resena.create({ id_inscripcion, calificacion, comentario });
}

export async function listarPorActividad(id_actividad) {
  const resenas = await Resena.findAll({
    include: [{
      model: Inscripcion,
      as: 'inscripcion',
      where: { id_actividad },
      attributes: ['id_inscripcion'],
      include: [{ model: PerfilVoluntario, as: 'voluntario', attributes: ['nombre', 'apellido'] }],
    }],
    order: [['fecha_resena', 'DESC']],
  });
  return resenas.map((r) => ({
    id_resena: r.id_resena,
    calificacion: r.calificacion,
    comentario: r.comentario,
    voluntario: `${r.inscripcion.voluntario.nombre} ${r.inscripcion.voluntario.apellido}`,
    fecha_resena: r.fecha_resena,
  }));
}
