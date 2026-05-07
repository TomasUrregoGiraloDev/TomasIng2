import { z } from 'zod';
import * as AuthService from '../services/AuthService.js';

export const schemas = {
  registrarVoluntario: z.object({
    correo_electronico: z.string().email(),
    contrasena: z.string().min(8, 'minimo 8 caracteres'),
    nombre: z.string().min(2),
    apellido: z.string().min(2),
    telefono: z.string().optional(),
    id_ciudad: z.coerce.number().int().optional(),
    intereses: z.string().optional(),
  }),
  registrarOrganizacion: z.object({
    correo_electronico: z.string().email(),
    contrasena: z.string().min(8, 'minimo 8 caracteres'),
    nombre_institucion: z.string().min(2),
    nit_registro: z.string().min(5),
    telefono: z.string().optional(),
    id_ciudad: z.coerce.number().int().optional(),
    descripcion_org: z.string().optional(),
  }),
  login: z.object({
    correo_electronico: z.string().email(),
    contrasena: z.string().min(1),
  }),
};

export async function registrarVoluntario(req, res, next) {
  try { res.status(201).json(await AuthService.registrarVoluntario(req.body)); }
  catch (e) { next(e); }
}

export async function registrarOrganizacion(req, res, next) {
  try { res.status(201).json(await AuthService.registrarOrganizacion(req.body)); }
  catch (e) { next(e); }
}

export async function login(req, res, next) {
  try { res.json(await AuthService.login(req.body)); }
  catch (e) { next(e); }
}

export async function me(req, res, next) {
  try { res.json(await AuthService.obtenerUsuarioActual(req.user.sub)); }
  catch (e) { next(e); }
}
