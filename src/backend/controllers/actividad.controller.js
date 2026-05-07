import { z } from 'zod';
import * as ActividadService from '../services/ActividadService.js';

// Acepta URLs http(s) o data URIs base64 (cuando suben imagen desde el computador).
const imagenSchema = z.union([
  z.literal(''),
  z.string().url(),
  z.string().regex(/^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=]+$/, 'imagen invalida'),
]).optional();

export const schemas = {
  crear: z.object({
    titulo: z.string().min(3),
    descripcion: z.string().min(10),
    id_categoria: z.coerce.number().int(),
    id_ciudad: z.coerce.number().int(),
    fecha_evento: z.string().refine(
      (v) => !Number.isNaN(Date.parse(v)) && new Date(v).getTime() >= Date.now() - 60_000,
      { message: 'la fecha no puede estar en el pasado' },
    ),
    direccion: z.string().min(3),
    cupos_totales: z.coerce.number().int().min(1),
    imagen_url: imagenSchema,
  }),
  actualizar: z.object({
    titulo: z.string().min(3).optional(),
    descripcion: z.string().min(10).optional(),
    id_categoria: z.coerce.number().int().optional(),
    id_ciudad: z.coerce.number().int().optional(),
    fecha_evento: z.string().optional(),
    direccion: z.string().min(3).optional(),
    cupos_totales: z.coerce.number().int().min(1).optional(),
    cupos_disponibles: z.coerce.number().int().min(0).optional(),
    estado_actividad: z.enum(['BORRADOR', 'PUBLICADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA']).optional(),
    imagen_url: imagenSchema,
  }).strict(),
};

export async function listar(req, res, next) {
  try {
    const filtros = {
      q: req.query.q,
      id_categoria: req.query.id_categoria ? Number(req.query.id_categoria) : undefined,
      id_ciudad: req.query.id_ciudad ? Number(req.query.id_ciudad) : undefined,
      fecha: req.query.fecha,
      id_organizacion: req.query.id_organizacion ? Number(req.query.id_organizacion) : undefined,
      soloActivas: req.query.todas !== 'true',
    };
    res.json(await ActividadService.listar(filtros));
  } catch (e) { next(e); }
}

export async function obtener(req, res, next) {
  try { res.json(await ActividadService.obtener(Number(req.params.id))); }
  catch (e) { next(e); }
}

export async function crear(req, res, next) {
  try { res.status(201).json(await ActividadService.crear(req.user.sub, req.body)); }
  catch (e) { next(e); }
}

export async function actualizar(req, res, next) {
  try { res.json(await ActividadService.actualizar(req.user.sub, Number(req.params.id), req.body)); }
  catch (e) { next(e); }
}

export async function cancelar(req, res, next) {
  try { res.json(await ActividadService.cancelar(req.user.sub, Number(req.params.id))); }
  catch (e) { next(e); }
}

export async function eliminar(req, res, next) {
  try {
    await ActividadService.eliminar(req.user.sub, Number(req.params.id));
    res.status(204).end();
  } catch (e) { next(e); }
}
