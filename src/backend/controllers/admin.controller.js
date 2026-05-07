import { z } from 'zod';
import * as Service from '../services/AdminService.js';
import * as ReporteIA from '../services/ReporteIAService.js';

export const schemas = {
  cambiarEstadoOrg: z.object({ estado_verificacion: z.enum(['PENDIENTE', 'VERIFICADA', 'SUSPENDIDA']) }),
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
