import { buscarEventoService } from './service.mjs';

/**
 * AWS Lambda entrega el JSON enviado en --payload como un objeto JavaScript.
 * @param {{ eventId: number }} event Ejemplo de entrada: { eventId: 3 }
 */
export function buscarEventoHandler(event) {
  const { eventId } = event ?? {};
  if (!Number.isSafeInteger(eventId) || eventId < 1) {
    throw new Error('Indica un ID de evento entero positivo');
  }

  return buscarEventoService(eventId);
}
