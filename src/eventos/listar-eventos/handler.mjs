import { listarEventosService } from './service.mjs';

export function handler({ cursor } = {}) {
  return listarEventosService(cursor);
}
