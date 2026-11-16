import { buscarEventoService } from './service.mjs';

export function buscarEventoHandler(event) {
  const { eventId } = event ?? {};
  if (!Number.isSafeInteger(eventId) || eventId < 1) {
    throw new Error('Indica un ID de evento entero positivo');
  }

  return buscarEventoService(eventId);
}
