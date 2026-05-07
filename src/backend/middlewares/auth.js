import { verifyToken } from '../utils/jwt.js';
import { HttpError } from './error.js';

export function authRequired(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(new HttpError(401, 'Token requerido'));
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new HttpError(401, 'Token invalido o expirado'));
  }
}

export const requireRol = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new HttpError(401, 'No autenticado'));
  if (!roles.includes(req.user.rol)) return next(new HttpError(403, 'Permiso denegado'));
  next();
};
