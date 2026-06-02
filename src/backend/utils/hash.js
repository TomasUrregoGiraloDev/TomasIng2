// ============================================================
// Utilidad hash
// Tabla(s) BD : —
// HU          : HU10, HU14
// RF          : RF-001, RF-002, RF-003
// ============================================================
import bcrypt from 'bcryptjs';

export const hashPassword = (plain) => bcrypt.hash(plain, 10);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);
