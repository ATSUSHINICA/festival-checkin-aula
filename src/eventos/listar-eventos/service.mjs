import { listarEventosRepository } from './repository.mjs';

export function listarEventosService(cursor) {
  return listarEventosRepository(cursor);
}
