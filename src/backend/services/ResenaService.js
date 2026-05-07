import { Resena, Inscripcion, PerfilVoluntario } from '../models/index.js';
import { HttpError } from '../middlewares/error.js';

// CU-06 | RF-014 | E13 - registrarResena()
export async function crear(id_usuario, { id_inscripcion, calificacion, comentario }) {
  const ins = await Inscripcion.findByPk(id_inscripcion, {
    include: [{ model: PerfilVoluntario, as: 'voluntario' }],
  });
  if (!ins) throw new HttpError(404, 'Inscripcion no encontrada');
  if (ins.voluntario.id_usuario !== id_usuario) {
    throw new HttpError(403, 'No puedes reseñar esta inscripcion');
  }
  if (ins.estado_solicitud !== 'ASISTIO') {
    throw new HttpError(409, 'Solo puedes reseñar despues de asistir');
  }
  const existente = await Resena.findOne({ where: { id_inscripcion } });
  if (existente) throw new HttpError(409, 'Ya existe una reseña para esta inscripcion');
  return Resena.create({ id_inscripcion, calificacion, comentario });
}

export async function listarPorActividad(id_actividad) {
  const inscripciones = await Inscripcion.findAll({
    where: { id_actividad },
    include: [
      { model: Resena, as: 'resena' },
      { model: PerfilVoluntario, as: 'voluntario', attributes: ['nombre', 'apellido'] },
    ],
  });
  return inscripciones
    .filter((i) => i.resena)
    .map((i) => ({
      id_resena: i.resena.id_resena,
      calificacion: i.resena.calificacion,
      comentario: i.resena.comentario,
      voluntario: `${i.voluntario.nombre} ${i.voluntario.apellido}`,
      fecha_resena: i.resena.fecha_resena,
    }));
}
