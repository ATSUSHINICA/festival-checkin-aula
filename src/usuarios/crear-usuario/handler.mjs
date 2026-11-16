import { crearUsuarioService } from './service.mjs';

export function handler({ userId, firstName, lastName, email, city } = {}) {
  return crearUsuarioService({ userId, firstName, lastName, email, city });
}
