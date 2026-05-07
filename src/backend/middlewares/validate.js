import { HttpError } from './error.js';

export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
    return next(new HttpError(400, 'Datos invalidos', details));
  }
  req[source] = result.data;
  next();
};
