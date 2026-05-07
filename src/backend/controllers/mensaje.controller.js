import { z } from 'zod';
import * as Service from '../services/MensajeService.js';

export const schemas = {
  enviar: z.object({
    id_usuario_destinatario: z.coerce.number().int(),
    contenido: z.string().min(1).max(2000),
    id_actividad: z.coerce.number().int().optional(),
  }),
};

export async function listar(req, res, next) {
  try { res.json(await Service.listarConversaciones(req.user.sub)); }
  catch (e) { next(e); }
}

export async function conversacion(req, res, next) {
  try { res.json(await Service.obtenerConversacion(req.user.sub, Number(req.params.userId))); }
  catch (e) { next(e); }
}

export async function enviar(req, res, next) {
  try { res.status(201).json(await Service.enviar(req.user.sub, req.body)); }
  catch (e) { next(e); }
}
