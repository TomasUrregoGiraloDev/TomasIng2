import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { assertDatabaseConnection, sequelize } from './config/db.js';
import { errorHandler } from './middlewares/error.js';
import './models/index.js';

import authRoutes from './routes/auth.routes.js';
import perfilRoutes from './routes/perfil.routes.js';
import catalogosRoutes from './routes/catalogos.routes.js';
import actividadesRoutes from './routes/actividades.routes.js';
import inscripcionesRoutes from './routes/inscripciones.routes.js';
import resenasRoutes from './routes/resenas.routes.js';
import notificacionesRoutes from './routes/notificaciones.routes.js';
import mensajesRoutes from './routes/mensajes.routes.js';
import adminRoutes from './routes/admin.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.use((req, res) => res.status(404).json({ error: 'Recurso no encontrado' }));
app.use(errorHandler);

async function start() {
  try {
    await assertDatabaseConnection();
    await sequelize.sync();
    app.listen(env.port, () => {
      console.log(`Backend escuchando en http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
}

start();
