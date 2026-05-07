import { Usuario, PerfilVoluntario, PerfilOrganizacion, PerfilAdmin, Ciudad } from '../models/index.js';
import { HttpError } from '../middlewares/error.js';

async function obtenerPerfilPorUsuario(id_usuario, rol) {
  if (rol === 'VOLUNTARIO') return PerfilVoluntario.findOne({ where: { id_usuario } });
  if (rol === 'ORGANIZACION') return PerfilOrganizacion.findOne({ where: { id_usuario } });
  if (rol === 'ADMIN') return PerfilAdmin.findOne({ where: { id_usuario } });
  return null;
}

// CU-01 | RF-002 | E13 - obtenerPerfil()
export async function obtenerPerfil(id_usuario, rol) {
  const perfil = await obtenerPerfilPorUsuario(id_usuario, rol);
  if (!perfil) throw new HttpError(404, 'Perfil no encontrado');
  const usuario = await Usuario.findByPk(id_usuario, { include: [{ model: Ciudad, as: 'ciudad' }] });
  return { perfil, usuario };
}

// CU-01 | RF-002 | E13 - actualizarPerfil()
export async function actualizarPerfil(id_usuario, rol, datos) {
  const perfil = await obtenerPerfilPorUsuario(id_usuario, rol);
  if (!perfil) throw new HttpError(404, 'Perfil no encontrado');
  const camposPerfil = { ...datos };
  delete camposPerfil.id_ciudad;
  await perfil.update(camposPerfil);
  if (datos.id_ciudad !== undefined) {
    await Usuario.update({ id_ciudad: datos.id_ciudad }, { where: { id_usuario } });
  }
  return obtenerPerfil(id_usuario, rol);
}
