import { crearEvento } from './service.mjs';

export function handler({ eventId, title } = {}) {
  return crearEvento(eventId, title);
}
