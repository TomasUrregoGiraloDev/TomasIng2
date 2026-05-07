import * as Service from '../services/NotificacionService.js';

export async function listar(req, res, next) {
  try { res.json(await Service.listarPorUsuario(req.user.sub)); }
  catch (e) { next(e); }
}

export async function marcarLeida(req, res, next) {
  try { res.json(await Service.marcarLeida(req.user.sub, Number(req.params.id))); }
  catch (e) { next(e); }
}
