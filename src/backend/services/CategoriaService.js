import { Categoria } from '../models/index.js';
import { HttpError } from '../middlewares/error.js';

// CU-MAESTRA | RF-006 | E13 - listarCategorias()
export async function listarCategorias() {
  return Categoria.findAll({ order: [['nombre_categoria', 'ASC']] });
}

// CU-MAESTRA | RF-006 | E13 - crearCategoria()
export async function crearCategoria({ nombre_categoria, descripcion }) {
  const existe = await Categoria.findOne({ where: { nombre_categoria } });
  if (existe) throw new HttpError(409, 'Ya existe una categoria con ese nombre');
  return Categoria.create({ nombre_categoria, descripcion });
}

// CU-MAESTRA | RF-006 | E13 - actualizarCategoria()
export async function actualizarCategoria(id_categoria, { nombre_categoria, descripcion }) {
  const cat = await Categoria.findByPk(id_categoria);
  if (!cat) throw new HttpError(404, 'Categoria no encontrada');
  const duplicado = await Categoria.findOne({ where: { nombre_categoria } });
  if (duplicado && duplicado.id_categoria !== id_categoria) throw new HttpError(409, 'Ya existe una categoria con ese nombre');
  return cat.update({ nombre_categoria, descripcion });
}

// CU-MAESTRA | RF-006 | E13 - eliminarCategoria()
export async function eliminarCategoria(id_categoria) {
  const cat = await Categoria.findByPk(id_categoria);
  if (!cat) throw new HttpError(404, 'Categoria no encontrada');
  await cat.destroy();
}
