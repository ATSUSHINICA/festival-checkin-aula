import { buscarEventoRepository } from './repository.mjs';

export function buscarEventoService(eventId) {
  return buscarEventoRepository(eventId);
}
