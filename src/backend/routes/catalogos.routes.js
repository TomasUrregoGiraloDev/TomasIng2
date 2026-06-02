// ============================================================
// Ruta catalogos.routes
// Tabla(s) BD : CIUDAD, CATEGORIA
// HU          : HU01, HU10
// RF          : RF-001, RF-006
// ============================================================
import { Router } from 'express';
import { Ciudad, Categoria, Rol } from '../models/index.js';

const router = Router();

// RF-001 | HU10 - lista de roles del sistema
router.get('/roles', async (_req, res, next) => {
  try { res.json(await Rol.findAll({ order: [['id_rol', 'ASC']] })); }
  catch (e) { next(e); }
});

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
