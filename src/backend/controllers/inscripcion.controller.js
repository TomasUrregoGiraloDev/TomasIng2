import { z } from 'zod';
import * as Service from '../services/InscripcionService.js';

export const schemas = {
  crear: z.object({ id_actividad: z.coerce.number().int() }),
  cambiarEstado: z.object({ estado_solicitud: z.enum(['APROBADA', 'RECHAZADA', 'ASISTIO', 'NO_ASISTIO']) }),
};

export async function listar(req, res, next) {
  try {
    res.json(await Service.listar(req.user.sub, req.user.rol, {
      estado: req.query.estado,
      id_actividad: req.query.id_actividad ? Number(req.query.id_actividad) : undefined,
    }));
  } catch (e) { next(e); }
}

export async function crear(req, res, next) {
  try { res.status(201).json(await Service.crear(req.user.sub, req.body)); }
  catch (e) { next(e); }
}

export async function cambiarEstado(req, res, next) {
  try {
    res.json(await Service.cambiarEstado(req.user.sub, req.user.rol, Number(req.params.id), req.body.estado_solicitud));
  } catch (e) { next(e); }
}
