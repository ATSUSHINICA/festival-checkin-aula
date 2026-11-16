import { crearEventoRepository } from './repository.mjs';

export async function crearEventoService(eventId, title) {
  if (!Number.isSafeInteger(eventId) || eventId < 1) {
    throw new Error('Indica un ID de evento entero positivo');
  }
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error('Escribe un título para el evento');
  }

  await crearEventoRepository(eventId, title);
  return { eventId, title };
}
