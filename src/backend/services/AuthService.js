import { Usuario, PerfilVoluntario, PerfilOrganizacion, PerfilAdmin, Rol, Ciudad } from '../models/index.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import { HttpError } from '../middlewares/error.js';

async function getRolByNombre(nombre_rol) {
  const rol = await Rol.findOne({ where: { nombre_rol } });
  if (!rol) throw new HttpError(500, `Rol ${nombre_rol} no existe en BD`);
  return rol;
}

function tokenPayload(usuario, nombreRol) {
  return { sub: usuario.id_usuario, email: usuario.correo_electronico, rol: nombreRol };
}

// CU-01 | RF-001 | E13 - registrarVoluntario()
export async function registrarVoluntario(datos) {
  const rol = await getRolByNombre('VOLUNTARIO');
  const contrasena = await hashPassword(datos.contrasena);
  const usuario = await Usuario.create({
    correo_electronico: datos.correo_electronico,
    contrasena,
    id_rol: rol.id_rol,
    id_ciudad: datos.id_ciudad,
  });
  await PerfilVoluntario.create({
    id_usuario: usuario.id_usuario,
    nombre: datos.nombre,
    apellido: datos.apellido,
    telefono: datos.telefono,
    intereses: datos.intereses,
  });
  return tokenize(usuario, rol.nombre_rol);
}

// CU-01 | RF-001 | E13 - registrarOrganizacion()
export async function registrarOrganizacion(datos) {
  const rol = await getRolByNombre('ORGANIZACION');
  const contrasena = await hashPassword(datos.contrasena);
  const usuario = await Usuario.create({
    correo_electronico: datos.correo_electronico,
    contrasena,
    id_rol: rol.id_rol,
    id_ciudad: datos.id_ciudad,
  });
  await PerfilOrganizacion.create({
    id_usuario: usuario.id_usuario,
    nombre_institucion: datos.nombre_institucion,
    nit_registro: datos.nit_registro,
    telefono: datos.telefono,
    descripcion_org: datos.descripcion_org,
  });
  return tokenize(usuario, rol.nombre_rol);
}

// CU-01 | RF-001 | E13 - login()
export async function login({ correo_electronico, contrasena }) {
  const usuario = await Usuario.scope('withPassword').findOne({
    where: { correo_electronico },
    include: [{ model: Rol, as: 'rol' }],
  });
  if (!usuario) throw new HttpError(401, 'Credenciales invalidas');
  const ok = await verifyPassword(contrasena, usuario.contrasena);
  if (!ok) throw new HttpError(401, 'Credenciales invalidas');
  return tokenize(usuario, usuario.rol.nombre_rol);
}

function tokenize(usuario, nombreRol) {
  return {
    token: signToken(tokenPayload(usuario, nombreRol)),
    usuario: {
      id_usuario: usuario.id_usuario,
      correo_electronico: usuario.correo_electronico,
      rol: nombreRol,
    },
  };
}

// CU-01 | RF-002 | E13 - obtenerUsuarioActual()
export async function obtenerUsuarioActual(id_usuario) {
  const usuario = await Usuario.findByPk(id_usuario, {
    include: [
      { model: Rol, as: 'rol' },
      { model: Ciudad, as: 'ciudad' },
      { model: PerfilVoluntario, as: 'perfilVoluntario' },
      { model: PerfilOrganizacion, as: 'perfilOrganizacion' },
      { model: PerfilAdmin, as: 'perfilAdmin' },
    ],
  });
  if (!usuario) throw new HttpError(404, 'Usuario no encontrado');
  const perfil = usuario.perfilVoluntario || usuario.perfilOrganizacion || usuario.perfilAdmin;
  return {
    id_usuario: usuario.id_usuario,
    correo_electronico: usuario.correo_electronico,
    rol: usuario.rol.nombre_rol,
    ciudad: usuario.ciudad,
    perfil,
  };
}
