export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if (err?.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Conflicto de unicidad', details: err.errors?.map(e => e.message) });
  }
  if (err?.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Datos invalidos', details: err.errors?.map(e => e.message) });
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}
