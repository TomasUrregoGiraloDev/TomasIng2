import {
  sequelize,
  Rol,
  Usuario,
  Ciudad,
  Categoria,
  PerfilVoluntario,
  PerfilOrganizacion,
  PerfilAdmin,
  Actividad,
  Inscripcion,
} from '../models/index.js';
import { hashPassword } from '../utils/hash.js';

const ROLES = [
  { nombre_rol: 'VOLUNTARIO' },
  { nombre_rol: 'ORGANIZACION' },
  { nombre_rol: 'ADMIN' },
];

const CIUDADES = [
  { nombre_ciudad: 'Medellin', departamento: 'Antioquia' },
  { nombre_ciudad: 'Bogota', departamento: 'Cundinamarca' },
  { nombre_ciudad: 'Cali', departamento: 'Valle del Cauca' },
  { nombre_ciudad: 'Cartagena', departamento: 'Bolivar' },
  { nombre_ciudad: 'Barranquilla', departamento: 'Atlantico' },
  { nombre_ciudad: 'Bucaramanga', departamento: 'Santander' },
];

const CATEGORIAS = [
  { nombre_categoria: 'Medio Ambiente', descripcion: 'Reforestacion, limpieza, conservacion' },
  { nombre_categoria: 'Educacion', descripcion: 'Apoyo escolar, alfabetizacion' },
  { nombre_categoria: 'Salud', descripcion: 'Brigadas de salud, donacion de sangre' },
  { nombre_categoria: 'Animales', descripcion: 'Refugios, esterilizacion, adopcion' },
  { nombre_categoria: 'Comunidad', descripcion: 'Apoyo a poblaciones vulnerables' },
];

async function seedCatalogos() {
  for (const r of ROLES) await Rol.findOrCreate({ where: { nombre_rol: r.nombre_rol }, defaults: r });
  for (const c of CIUDADES) await Ciudad.findOrCreate({ where: { nombre_ciudad: c.nombre_ciudad, departamento: c.departamento }, defaults: c });
  for (const c of CATEGORIAS) await Categoria.findOrCreate({ where: { nombre_categoria: c.nombre_categoria }, defaults: c });
}

async function seedUsuariosDemo() {
  const rolVol = await Rol.findOne({ where: { nombre_rol: 'VOLUNTARIO' } });
  const rolOrg = await Rol.findOne({ where: { nombre_rol: 'ORGANIZACION' } });
  const rolAdm = await Rol.findOne({ where: { nombre_rol: 'ADMIN' } });
  const medellin = await Ciudad.findOne({ where: { nombre_ciudad: 'Medellin' } });
  const password = await hashPassword('Demo1234');

  const [voluntario] = await Usuario.findOrCreate({
    where: { correo_electronico: 'voluntario@demo.com' },
    defaults: { correo_electronico: 'voluntario@demo.com', contrasena: password, id_rol: rolVol.id_rol, id_ciudad: medellin.id_ciudad },
  });
  await PerfilVoluntario.findOrCreate({
    where: { id_usuario: voluntario.id_usuario },
    defaults: {
      id_usuario: voluntario.id_usuario,
      nombre: 'Maria',
      apellido: 'Lopez',
      telefono: '3001234567',
      intereses: 'Medio Ambiente, Educacion',
    },
  });

  const [organizacion] = await Usuario.findOrCreate({
    where: { correo_electronico: 'org@demo.com' },
    defaults: { correo_electronico: 'org@demo.com', contrasena: password, id_rol: rolOrg.id_rol, id_ciudad: medellin.id_ciudad },
  });
  await PerfilOrganizacion.findOrCreate({
    where: { id_usuario: organizacion.id_usuario },
    defaults: {
      id_usuario: organizacion.id_usuario,
      nombre_institucion: 'Fundacion Ambiental Verde',
      nit_registro: '900123456-1',
      telefono: '6041234567',
      descripcion_org: 'Trabajamos por la conservacion de los ecosistemas locales',
      estado_verificacion: 'VERIFICADA',
    },
  });

  const [orgPendiente] = await Usuario.findOrCreate({
    where: { correo_electronico: 'org.pendiente@demo.com' },
    defaults: { correo_electronico: 'org.pendiente@demo.com', contrasena: password, id_rol: rolOrg.id_rol, id_ciudad: medellin.id_ciudad },
  });
  await PerfilOrganizacion.findOrCreate({
    where: { id_usuario: orgPendiente.id_usuario },
    defaults: {
      id_usuario: orgPendiente.id_usuario,
      nombre_institucion: 'Comunidad Por Verificar',
      nit_registro: '900111222-3',
      telefono: '6041112223',
      descripcion_org: 'Organizacion en espera de verificacion',
      estado_verificacion: 'PENDIENTE',
    },
  });

  // Segunda org pendiente: la usa el flujo de admin (verificar)
  const [orgRenacer] = await Usuario.findOrCreate({
    where: { correo_electronico: 'org.renacer@demo.com' },
    defaults: { correo_electronico: 'org.renacer@demo.com', contrasena: password, id_rol: rolOrg.id_rol, id_ciudad: medellin.id_ciudad },
  });
  await PerfilOrganizacion.findOrCreate({
    where: { id_usuario: orgRenacer.id_usuario },
    defaults: {
      id_usuario: orgRenacer.id_usuario,
      nombre_institucion: 'Asociacion Comunitaria Renacer',
      nit_registro: '900987654-2',
      telefono: '6049876543',
      descripcion_org: 'Apoyo a poblaciones vulnerables',
      estado_verificacion: 'PENDIENTE',
    },
  });

  const [admin] = await Usuario.findOrCreate({
    where: { correo_electronico: 'admin@demo.com' },
    defaults: { correo_electronico: 'admin@demo.com', contrasena: password, id_rol: rolAdm.id_rol, id_ciudad: medellin.id_ciudad },
  });
  await PerfilAdmin.findOrCreate({
    where: { id_usuario: admin.id_usuario },
    defaults: { id_usuario: admin.id_usuario, nombre: 'Carlos', apellido: 'Ramirez', nivel_acceso: 'GENERAL' },
  });
}

async function seedActividadesDemo() {
  const orgVerificada = await PerfilOrganizacion.findOne({ where: { estado_verificacion: 'VERIFICADA' } });
  const cat = await Categoria.findOne({ where: { nombre_categoria: 'Medio Ambiente' } });
  const ciudad = await Ciudad.findOne({ where: { nombre_ciudad: 'Medellin' } });
  const voluntario = await PerfilVoluntario.findOne();

  const actividades = [
    {
      titulo: 'Jornada de Reforestacion en Parque Arvi',
      descripcion: 'Unete a nuestra jornada. Plantaremos mas de 200 arboles nativos para recuperar las zonas verdes. No se necesita experiencia previa.',
      fecha_evento: '2026-06-15 08:00:00',
      direccion: 'Parque Arvi, Medellin',
      cupos_totales: 30,
      cupos_disponibles: 18,
      imagen_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    },
    {
      titulo: 'Limpieza del Rio Medellin',
      descripcion: 'Recolectaremos residuos solidos a lo largo de la cuenca media del rio. Llevar guantes y protector solar.',
      fecha_evento: '2026-06-22 07:30:00',
      direccion: 'Av. Regional, sector Industriales',
      cupos_totales: 50,
      cupos_disponibles: 32,
      imagen_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    },
    {
      titulo: 'Taller de Educacion Ambiental',
      descripcion: 'Sesion teorico-practica con ninos de la comunidad sobre cuidado del agua y reciclaje.',
      fecha_evento: '2026-07-05 09:00:00',
      direccion: 'Biblioteca Publica Comuna 13',
      cupos_totales: 15,
      cupos_disponibles: 9,
      imagen_url: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800',
    },
  ];

  for (const a of actividades) {
    await Actividad.findOrCreate({
      where: { titulo: a.titulo },
      defaults: {
        ...a,
        id_organizacion: orgVerificada.id_organizacion,
        id_categoria: cat.id_categoria,
        id_ciudad: ciudad.id_ciudad,
        estado_actividad: 'PUBLICADA',
      },
    });
  }

  if (voluntario) {
    const act = await Actividad.findOne({ where: { titulo: actividades[0].titulo } });
    await Inscripcion.findOrCreate({
      where: { id_voluntario: voluntario.id_voluntario, id_actividad: act.id_actividad },
      defaults: {
        id_voluntario: voluntario.id_voluntario,
        id_actividad: act.id_actividad,
        estado_solicitud: 'APROBADA',
      },
    });
  }
}

export async function runSeed({ resetSchema = false } = {}) {
  await sequelize.authenticate();
  if (resetSchema) await sequelize.sync({ force: true });
  else await sequelize.sync();
  await seedCatalogos();
  await seedUsuariosDemo();
  await seedActividadesDemo();
}

const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  const reset = process.argv.includes('--reset');
  runSeed({ resetSchema: reset })
    .then(() => {
      console.log(reset ? 'Esquema reiniciado y datos sembrados.' : 'Datos sembrados.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error en seed:', err);
      process.exit(1);
    });
}
