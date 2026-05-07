import { Router } from 'express';
import { Op } from 'sequelize';
import { authRequired } from '../middlewares/auth.js';
import { Usuario, Rol, PerfilVoluntario, PerfilOrganizacion, PerfilAdmin } from '../models/index.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res, next) => {
  try {
    const where = { id_usuario: { [Op.ne]: req.user.sub } };
    if (req.query.q) where.correo_electronico = { [Op.like]: `%${req.query.q}%` };

    const usuarios = await Usuario.findAll({
      where,
      include: [
        { model: Rol, as: 'rol' },
        { model: PerfilVoluntario, as: 'perfilVoluntario', attributes: ['nombre', 'apellido'] },
        { model: PerfilOrganizacion, as: 'perfilOrganizacion', attributes: ['nombre_institucion'] },
        { model: PerfilAdmin, as: 'perfilAdmin', attributes: ['nombre', 'apellido'] },
      ],
      limit: 50,
    });

    res.json(usuarios.map((u) => ({
      id_usuario: u.id_usuario,
      correo_electronico: u.correo_electronico,
      rol: u.rol.nombre_rol,
      nombre: u.perfilVoluntario
        ? `${u.perfilVoluntario.nombre} ${u.perfilVoluntario.apellido}`
        : u.perfilOrganizacion
          ? u.perfilOrganizacion.nombre_institucion
          : u.perfilAdmin
            ? `${u.perfilAdmin.nombre} ${u.perfilAdmin.apellido}`
            : u.correo_electronico,
    })));
  } catch (e) { next(e); }
});

export default router;
