import { crearEventoService } from './service.mjs';

export function handler({ eventId, title } = {}) {
  return crearEventoService(eventId, title);
}
