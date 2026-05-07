import { Router } from 'express';
import { Ciudad, Categoria } from '../models/index.js';

const router = Router();

router.get('/ciudades', async (_req, res, next) => {
  try { res.json(await Ciudad.findAll({ order: [['nombre_ciudad', 'ASC']] })); }
  catch (e) { next(e); }
});

router.get('/categorias', async (_req, res, next) => {
  try { res.json(await Categoria.findAll({ order: [['nombre_categoria', 'ASC']] })); }
  catch (e) { next(e); }
});

router.get('/estados-actividad', (_req, res) => {
  res.json([
    { codigo: 'BORRADOR', etiqueta: 'Borrador' },
    { codigo: 'PUBLICADA', etiqueta: 'Publicada' },
    { codigo: 'EN_CURSO', etiqueta: 'En curso' },
    { codigo: 'FINALIZADA', etiqueta: 'Finalizada' },
    { codigo: 'CANCELADA', etiqueta: 'Cancelada' },
  ]);
});

export default router;
