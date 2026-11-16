import { listarEventosService } from './service.mjs';

export function listarEventosHandler({ cursor } = {}) {
  return listarEventosService(cursor);
}
