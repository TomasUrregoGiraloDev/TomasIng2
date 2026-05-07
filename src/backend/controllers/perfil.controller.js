import { z } from 'zod';
import * as PerfilService from '../services/PerfilService.js';

export const schemas = {
  actualizar: z.object({
    nombre: z.string().min(2).optional(),
    apellido: z.string().min(2).optional(),
    nombre_institucion: z.string().min(2).optional(),
    nit_registro: z.string().min(5).optional(),
    telefono: z.string().optional(),
    descripcion_org: z.string().optional(),
    intereses: z.string().optional(),
    nivel_acceso: z.string().optional(),
    id_ciudad: z.coerce.number().int().optional(),
  }).strict(),
};

export async function obtener(req, res, next) {
  try { res.json(await PerfilService.obtenerPerfil(req.user.sub, req.user.rol)); }
  catch (e) { next(e); }
}

export async function actualizar(req, res, next) {
  try { res.json(await PerfilService.actualizarPerfil(req.user.sub, req.user.rol, req.body)); }
  catch (e) { next(e); }
}
