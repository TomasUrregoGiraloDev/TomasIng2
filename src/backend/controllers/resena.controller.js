import { z } from 'zod';
import * as Service from '../services/ResenaService.js';

export const schemas = {
  crear: z.object({
    id_inscripcion: z.coerce.number().int(),
    calificacion: z.coerce.number().int().min(1).max(5),
    comentario: z.string().max(1000).optional(),
  }),
};

export async function crear(req, res, next) {
  try { res.status(201).json(await Service.crear(req.user.sub, req.body)); }
  catch (e) { next(e); }
}

export async function listarPorActividad(req, res, next) {
  try { res.json(await Service.listarPorActividad(Number(req.params.actividadId))); }
  catch (e) { next(e); }
}
