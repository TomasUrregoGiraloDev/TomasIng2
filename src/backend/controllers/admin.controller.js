// ============================================================
// Controlador admin.controller
// Tabla(s) BD : ROL
// HU          : HU10, HU16, HU17
// RF          : RF-001, RF-015, RF-016, RF-017
// RNF         : RNF-016, RNF-017
// ============================================================
import { z } from 'zod';
import * as Service from '../services/AdminService.js';
import * as CategoriaService from '../services/CategoriaService.js';
import * as ReporteIA from '../services/ReporteIAService.js';
import * as NotificacionService from '../services/NotificacionService.js';

export const schemas = {
  cambiarEstadoOrg: z.object({ estado_verificacion: z.enum(['PENDIENTE', 'VERIFICADA', 'SUSPENDIDA']) }),
  categoria: z.object({
    nombre_categoria: z.string().min(2).max(50),
    descripcion: z.string().max(255).optional(),
  }),
  rol: z.object({ nombre_rol: z.string().min(2).max(50) }),
  notificacion: z.object({
    id_usuario: z.coerce.number().int().positive(),
    tipo: z.string().min(2).max(40),
    titulo: z.string().min(2).max(150),
    mensaje: z.string().min(2).max(500),
  }),
};

export async function listarOrganizaciones(req, res, next) {
  try { res.json(await Service.listarOrganizaciones({ estado: req.query.estado, q: req.query.q })); }
  catch (e) { next(e); }
}

export async function cambiarEstadoOrganizacion(req, res, next) {
  try { res.json(await Service.cambiarEstadoOrganizacion(Number(req.params.id), req.body.estado_verificacion)); }
  catch (e) { next(e); }
}

export async function eliminarActividad(req, res, next) {
  try {
    await Service.eliminarActividad(Number(req.params.id));
    res.status(204).end();
  } catch (e) { next(e); }
}

export async function estadisticas(_req, res, next) {
  try { res.json(await Service.obtenerEstadisticas()); }
  catch (e) { next(e); }
}

export async function generarReporte(_req, res, next) {
  try { res.json(await ReporteIA.generarReporte()); }
  catch (e) { next(e); }
}

// CU-TRANSACCIONAL | RF-010 | E13 - listarNotificaciones()
export async function listarNotificaciones(_req, res, next) {
  try { res.json(await NotificacionService.listarTodas()); }
  catch (e) { next(e); }
}

// CU-TRANSACCIONAL | RF-010 | E13 - crearNotificacion()
export async function crearNotificacionAdmin(req, res, next) {
  try { res.status(201).json(await NotificacionService.crearNotificacion(req.body)); }
  catch (e) { next(e); }
}

// CU-TRANSACCIONAL | RF-011 | E13 - eliminarNotificacion()
export async function eliminarNotificacion(req, res, next) {
  try {
    await NotificacionService.eliminar(Number(req.params.id));
    res.status(204).end();
  } catch (e) { next(e); }
}

// CU-MAESTRA | RF-001 | E13 - listarRoles()
export async function listarRoles(_req, res, next) {
  try { res.json(await Service.listarRoles()); }
  catch (e) { next(e); }
}

// CU-MAESTRA | RF-001 | E13 - crearRol()
export async function crearRol(req, res, next) {
  try { res.status(201).json(await Service.crearRol(req.body)); }
  catch (e) { next(e); }
}

// CU-MAESTRA | RF-001 | E13 - actualizarRol()
export async function actualizarRol(req, res, next) {
  try { res.json(await Service.actualizarRol(Number(req.params.id), req.body)); }
  catch (e) { next(e); }
}

// CU-MAESTRA | RF-001 | E13 - eliminarRol()
export async function eliminarRol(req, res, next) {
  try {
    await Service.eliminarRol(Number(req.params.id));
    res.status(204).end();
  } catch (e) { next(e); }
}

export async function listarCategorias(_req, res, next) {
  try { res.json(await CategoriaService.listarCategorias()); }
  catch (e) { next(e); }
}

export async function crearCategoria(req, res, next) {
  try { res.status(201).json(await CategoriaService.crearCategoria(req.body)); }
  catch (e) { next(e); }
}

export async function actualizarCategoria(req, res, next) {
  try { res.json(await CategoriaService.actualizarCategoria(Number(req.params.id), req.body)); }
  catch (e) { next(e); }
}

export async function eliminarCategoria(req, res, next) {
  try {
    await CategoriaService.eliminarCategoria(Number(req.params.id));
    res.status(204).end();
  } catch (e) { next(e); }
}
